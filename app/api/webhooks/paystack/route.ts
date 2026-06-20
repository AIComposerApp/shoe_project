import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('Cryptographic Error: PAYSTACK_SECRET_KEY is undefined on the server.');
      return new Response('Paystack configuration missing on the server.', { status: 500 });
    }

    if (!signature) {
      console.warn('Cryptographic Warning: Missing x-paystack-signature header.');
      return new Response('No cryptographic signature supplied.', { status: 400 });
    }

    // Cryptographically verify Paystack Webhook call authenticity
    const calculatedHash = crypto.createHmac('sha512', paystackSecret).update(rawBody).digest('hex');

    if (calculatedHash !== signature) {
      console.error('Cryptographic Violation: Signature mismatch detected!');
      return new Response('Cryptographic signature verify failed.', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log(`Verified Paystack event received: "${payload.event}"`);

    // Complete transaction only on charge.success event
    if (payload.event === 'charge.success') {
      const data = payload.data;
      const reference = data.reference;
      
      const db = getFirestoreAdmin();
      const transactionRef = db.collection('transactions').doc(reference);
      const transactionDoc = await transactionRef.get();

      let email = data.customer?.email || 'customer@example.com';
      let amountNaira = data.amount / 100; // Paystack sends amounts in subunits (e.g. kobo)
      let amountUsd = data.metadata?.usdAmount || (amountNaira / 1500);
      let items = data.metadata?.items || [];

      if (!transactionDoc.exists) {
        console.log(`Heal Pattern: Transaction document ${reference} did not exist in db. Creating on-the-fly.`);
        await transactionRef.set({
          email,
          amount: amountNaira,
          usdAmount: amountUsd,
          status: 'completed',
          reference,
          items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        const transData = transactionDoc.data();
        if (transData) {
          email = transData.email || email;
          amountNaira = transData.amount || amountNaira;
          amountUsd = transData.usdAmount || transData.amount / 1500 || amountUsd;
          items = transData.items || items;
        }

        console.log(`Found pending transaction ${reference}, completing...`);
        await transactionRef.update({
          status: 'completed',
          updatedAt: new Date().toISOString(),
        });
      }

      // Dispatch automated notification email dispatches asynchronously
      const orderDetails = {
        email,
        amountNaira,
        amountUsd,
        reference,
        items,
      };

      try {
        await Promise.all([
          sendOrderConfirmationEmail(orderDetails),
          sendAdminNotificationEmail(orderDetails),
        ]);
        console.log(`Notification workflow executed successfully for reference ${reference}`);
      } catch (emailError) {
        console.error('Email notification dispatch error:', emailError);
      }
    }

    // Always respond 200 OK to Paystack within 2 seconds
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Paystack webhook routing crash:', error);
    return NextResponse.json({ error: error.message || 'Severe error during handling' }, { status: 500 });
  }
}
