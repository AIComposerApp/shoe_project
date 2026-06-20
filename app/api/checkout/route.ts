import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, amount, items, callbackUrl } = await req.json();

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Customer email and amount are required.' },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'Paystack Secret Key is not configured on the server. Please check your secrets configurations.' },
        { status: 500 }
      );
    }

    // Convert cart USD values to local NGN for Paystack sandbox currency testing (1 USD = 1,500 NGN)
    // Paystack amount must be passed in subunits (Kobo, which is Naira * 100)
    const amountInNaira = amount * 1500;
    const amountInKobo = Math.round(amountInNaira * 100);

    // Call Paystack API to initialize the transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        callback_url: callbackUrl,
        metadata: {
          items,
          usdAmount: amount,
        },
      }),
    });

    if (!paystackResponse.ok) {
      const errorText = await paystackResponse.text();
      console.error('Paystack initialization response error:', errorText);
      return NextResponse.json(
        { error: 'Paystack rejected transaction initialization.', details: errorText },
        { status: 500 }
      );
    }

    const paystackData = await paystackResponse.json();
    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Failed to generate Paystack transaction URL.' },
        { status: 400 }
      );
    }

    const { authorization_url, reference } = paystackData.data;

    // Securely register the pending transaction in Firestore
    try {
      const db = getFirestoreAdmin();
      await db.collection('transactions').doc(reference).set({
        email,
        amount: amountInNaira,
        usdAmount: amount,
        status: 'pending',
        reference,
        items: items || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (dbError: any) {
      console.error('Firestore saving pending transaction error:', dbError);
      // We still return authorization URL because the payment hook is resilient and can heal or record it later
    }

    return NextResponse.json({
      authorizationUrl: authorization_url,
      reference,
    });
  } catch (error: any) {
    console.error('Checkout routing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
