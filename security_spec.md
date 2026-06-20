# Security Specification: Paystack Transactions in Firestore

This security specification outlines how our Firestore collection `transactions` will be protected from unauthorized read/write access.

## Data Invariants
1. Transactions must be marked as `pending` upon creation.
2. A client can only create a transaction document if it matches the current server state, and the document must have a valid Paystack reference.
3. Only the Paystack server (verified through cryptographic signature on our Webhook endpoint) can update a transaction status to `completed` or `failed`.
4. Client SDKs are strongly forbidden from updating completed transactions or modifying any fields on a payment record once created.

## The "Dirty Dozen" Payloads (Relational & Auth Violations)
We define the payloads designed to break State, Identity, and Integrity. Client SDKs must be rejected for standard writes unless specifically authorized, but the safest and most robust path for transactional systems is restricting all writes through modern Server-controlled APIs.

1. **Spoofed Status Write**: Client attempts to write a transaction directly with status `completed`.
2. **Reference Injection**: Client injects an arbitrary string as a Paystack reference during a direct client-side collection write.
3. **Admin Field Elevation**: Attempting to set `role: "admin"` in user profiles.
4. **Altering Status Field**: Attempting to change an existing transaction status from `pending` to `completed` from client.
5. **PII Exposure Query**: Attempting to query all transactions in the system without ownership constraints.
6. **Value Poisoning**: Writing a negative amount or extremely large number for payment transactions.
7. **Temporal Violation**: Supplying client-side future timestamp for `createdAt`.
8. **Owner Spoofing**: Client attempts to set the buyer's email to another user's email.
9. **State Shortcutting**: Updating `status` directly to bypass the webhook workflow.
10. **Shadow Key Update**: Injecting extra non-whitelisted keys into a transaction document.
11. **ID Poisoning**: Injecting massive string IDs (> 128 characters) or junk char string.
12. **Orphaned Row Write**: Creating a transaction referencing a non-existent order.

## Fortress Rules Design Plan
We will deploy `firestore.rules` containing a default-deny block, blocking any non-admin write/create operations from the Client SDK as we execute all transactional processing server-side via Firebase Admin. This ensures total zero-trust protection.
