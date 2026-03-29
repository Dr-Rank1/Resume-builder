// ============================================
// STRIPE BILLING API
// Subscription and payment management
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  createCheckoutSession, 
  createCustomerPortal,
  SUBSCRIPTION_TIERS,
  handleWebhook 
} from '@/lib/stripe-billing';

// ============================================
// GET /api/billing
// Get subscription info and available tiers
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'tiers') {
      // Return available subscription tiers
      return NextResponse.json({
        success: true,
        data: {
          tiers: Object.entries(SUBSCRIPTION_TIERS).map(([id, tier]) => ({
            id,
            name: tier.name,
            price: tier.price,
            priceId: tier.priceId,
            features: tier.features,
            limits: tier.limits,
            isFree: tier.id === 'FREE',
          })),
        },
      });
    }

    // Get user's subscription status (would use auth in production)
    // For demo, return mock data
    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          tier: 'FREE',
          status: 'active',
          currentPeriodEnd: null,
        },
        usage: {
          resumes: { used: 1, limit: 3 },
          aiCredits: { used: 0, limit: 0 },
        },
      },
    });

  } catch (error) {
    console.error('Billing GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/billing
// Create checkout, portal, or handle webhook
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Handle Stripe webhooks
    if (action === 'webhook') {
      const signature = request.headers.get('stripe-signature');
      
      if (!signature) {
        return NextResponse.json(
          { error: 'Missing Stripe signature' },
          { status: 400 }
        );
      }

      const rawBody = await request.text();
      const result = await handleWebhook(rawBody, signature);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({ received: true });
    }

    // Check authentication for other actions
    // In production: const session = await getServerSession(authOptions);
    // For demo, we'll allow all actions

    if (action === 'createCheckout') {
      const { tierId, email, successUrl, cancelUrl } = data;

      if (!tierId || !email) {
        return NextResponse.json(
          { error: 'Missing tierId or email' },
          { status: 400 }
        );
      }

      if (!['PRO', 'PREMIUM'].includes(tierId)) {
        return NextResponse.json(
          { error: 'Invalid tier ID. Use PRO or PREMIUM' },
          { status: 400 }
        );
      }

      const session = await createCheckoutSession({
        userId: data.userId || 'demo-user',
        email,
        tierId,
        successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
        cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      });

      return NextResponse.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    }

    if (action === 'createPortal') {
      const { customerId } = data;

      if (!customerId) {
        return NextResponse.json(
          { error: 'Missing customerId' },
          { status: 400 }
        );
      }

      const session = await createCustomerPortal({
        customerId,
        returnUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      });

      return NextResponse.json({
        success: true,
        data: {
          url: session.url,
        },
      });
    }

    if (action === 'checkFeatureAccess') {
      const { tierId, feature } = data;

      if (!tierId || !feature) {
        return NextResponse.json(
          { error: 'Missing tierId or feature' },
          { status: 400 }
        );
      }

      const tier = SUBSCRIPTION_TIERS[tierId as keyof typeof SUBSCRIPTION_TIERS];
      
      if (!tier) {
        return NextResponse.json(
          { error: 'Invalid tier' },
          { status: 400 }
        );
      }

      const limit = tier.limits[feature as keyof typeof tier.limits];
      const hasAccess = limit === -1 || limit > 0;

      return NextResponse.json({
        success: true,
        data: {
          hasAccess,
          limit: limit === -1 ? 'unlimited' : limit,
          tier: tier.name,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Billing POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}