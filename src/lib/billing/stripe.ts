// ============================================
// STRIPE BILLING SYSTEM - ENTERPRISE MONETIZATION
// ============================================

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

// ============================================
// TYPES & CONSTANTS
// ============================================

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
  PAUSED = 'PAUSED',
}

// Pricing IDs from Stripe Dashboard
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  PREMIUM_ANNUAL: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
  AI_CREDITS_100: process.env.STRIPE_CREDITS_100_PRICE_ID!,
  AI_CREDITS_500: process.env.STRIPE_CREDITS_500_PRICE_ID!,
  AI_CREDITS_1000: process.env.STRIPE_CREDITS_1000_PRICE_ID!,
};

// Tier configurations
export const TIER_CONFIG = {
  [SubscriptionTier.FREE]: {
    name: 'Free',
    monthlyPrice: 0,
    features: [
      '3 resumes',
      '10 AI credits/month',
      'Basic templates',
      'Email support',
    ],
    limits: {
      resumes: 3,
      aiCredits: 10,
      atsScoring: false,
      interviewCoach: false,
      advancedTemplates: false,
    },
  },
  [SubscriptionTier.PRO]: {
    name: 'Pro',
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    features: [
      'Unlimited resumes',
      '100 AI credits/month',
      'ATS scoring',
      'All templates',
      'Priority support',
      'Custom domains',
    ],
    limits: {
      resumes: -1, // unlimited
      aiCredits: 100,
      atsScoring: true,
      interviewCoach: false,
      advancedTemplates: true,
    },
  },
  [SubscriptionTier.PREMIUM]: {
    name: 'Premium',
    monthlyPrice: 49.99,
    annualPrice: 499.99,
    features: [
      'Everything in Pro',
      'Unlimited AI credits',
      'Interview Coach',
      'Advanced analytics',
      'White-label resumes',
      'API access',
      'Dedicated support',
    ],
    limits: {
      resumes: -1,
      aiCredits: -1, // unlimited
      atsScoring: true,
      interviewCoach: true,
      advancedTemplates: true,
    },
  },
};

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export async function createOrGetStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Save customer ID to user
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  } catch (error) {
    return null;
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  organizationId?: string
): Promise<{ sessionId: string; url: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get or create customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    customerId = await createOrGetStripeCustomer(userId, user.email, user.name || undefined);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      organizationId: organizationId || '',
    },
    subscription_data: {
      metadata: {
        userId,
        organizationId: organizationId || '',
      },
    },
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return { url: session.url };
}

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<boolean> {
  try {
    if (cancelAtPeriodEnd) {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      await stripe.subscriptions.cancel(subscriptionId);
    }
    return true;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return false;
  }
}

export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Prorate the change
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    return updatedSubscription;
  } catch (error) {
    console.error('Plan change error:', error);
    return null;
  }
}

// ============================================
// CREDIT PURCHASES
// ============================================

export async function purchaseCredits(
  userId: string,
  credits: number,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    customerId = await createOrGetStripeCustomer(userId, user.email, user.name || undefined);
  }

  // Create one-time payment session for credits
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      credits: credits.toString(),
      type: 'credit_purchase',
    },
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

// ============================================
// WEBHOOK HANDLING
// ============================================

export interface WebhookEventData {
  type: string;
  data: Record<string, any>;
}

export async function handleWebhookEvent(
  payload: Buffer,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return { success: false, error: 'Invalid signature' };
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancel(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSuccess(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailure(invoice);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSuccess(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { success: false, error: 'Processing error' };
  }
}

// ============================================
// WEBHOOK EVENT HANDLERS
// ============================================

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const organizationId = session.metadata?.organizationId;
  const credits = session.metadata?.credits;
  
  if (!userId) return;

  // Handle subscription checkout
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await updateUserSubscription(userId, subscription, organizationId);
  }

  // Handle credit purchase
  if (credits && session.metadata?.type === 'credit_purchase') {
    await addPurchasedCredits(
      userId,
      parseInt(credits, 10),
      session.payment_intent as string
    );
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    // Try to find user by customer ID
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if (customer.deleted) return;
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customer.id },
    });
    if (!user) return;
    
    await updateUserSubscription(user.id, subscription, subscription.metadata?.organizationId);
    return;
  }
  
  await updateUserSubscription(userId, subscription, subscription.metadata?.organizationId);
}

async function handleSubscriptionCancel(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if (customer.deleted) return;
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customer.id },
    });
    if (!user) return;
    
    // Downgrade to free
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.CANCELED,
        subscriptionId: null,
      },
    });
    return;
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: SubscriptionTier.FREE,
      subscriptionStatus: SubscriptionStatus.CANCELED,
      subscriptionId: null,
    },
  });
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  // Log successful payment for analytics
  console.log(`Payment succeeded for customer: ${invoice.customer}`);
  
  // Could update analytics table here
  const organizationId = invoice.metadata?.organizationId;
  if (organizationId) {
    // Update revenue metrics
    await prisma.dailyAnalytics.upsert({
      where: {
        organizationId_date: {
          organizationId,
          date: new Date(),
        },
      },
      update: {
        revenueCents: { increment: (invoice.amount_paid / 100) * 100 },
      },
      create: {
        organizationId,
        date: new Date(),
        revenueCents: (invoice.amount_paid / 100) * 100,
      },
    });
  }
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  console.log(`Payment failed for customer: ${invoice.customer}`);
  
  // Update subscription status to past due
  if (invoice.subscription) {
    const userId = invoice.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: SubscriptionStatus.PAST_DUE,
        },
      });
    }
  }
}

async function handlePaymentIntentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Handle credit purchase payment intent success
  const userId = paymentIntent.metadata?.userId;
  const credits = paymentIntent.metadata?.credits;
  
  if (userId && credits) {
    await addPurchasedCredits(
      userId,
      parseInt(credits, 10),
      paymentIntent.id
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTierFromPriceId(priceId: string): SubscriptionTier {
  if (
    priceId === STRIPE_PRICES.PRO_MONTHLY ||
    priceId === STRIPE_PRICES.PRO_ANNUAL
  ) {
    return SubscriptionTier.PRO;
  }
  if (
    priceId === STRIPE_PRICES.PREMIUM_MONTHLY ||
    priceId === STRIPE_PRICES.PREMIUM_ANNUAL
  ) {
    return SubscriptionTier.PREMIUM;
  }
  return SubscriptionTier.FREE;
}

async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  organizationId?: string
) {
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = priceId ? getTierFromPriceId(priceId) : SubscriptionTier.FREE;
  
  const status = subscription.status === 'active' 
    ? SubscriptionStatus.ACTIVE 
    : subscription.status === 'trialing'
    ? SubscriptionStatus.TRIALING
    : SubscriptionStatus.PAST_DUE;
  
  const updateData: any = {
    subscriptionTier: tier,
    subscriptionStatus: status,
    stripeSubscriptionId: subscription.id,
    subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
  };

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  // If organization subscription, update org as well
  if (organizationId) {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: status,
        stripeSubscriptionId: subscription.id,
        subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      },
    });
  }
}

async function addPurchasedCredits(
  userId: string,
  credits: number,
  paymentId: string
) {
  await prisma.$transaction([
    // Update user's purchased credits
    prisma.user.update({
      where: { id: userId },
      data: {
        aiCreditsPurchased: { increment: credits },
      },
    }),
    // Create purchase record
    prisma.creditPurchase.create({
      data: {
        userId,
        credits,
        amountCents: credits * 10, // $0.10 per credit
        stripePaymentId: paymentId,
        status: 'COMPLETED',
      },
    }),
  ]);
}

// ============================================
// FEATURE ACCESS CHECK
// ============================================

export async function checkFeatureAccess(
  userId: string,
  feature: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      aiCredits: true,
      aiCreditsUsed: true,
      aiCreditsPurchased: true,
    },
  });

  if (!user) return false;

  const tierConfig = TIER_CONFIG[user.subscriptionTier as SubscriptionTier];
  if (!tierConfig) return false;

  // Check feature availability
  switch (feature) {
    case 'atsScoring':
      return tierConfig.limits.atsScoring;
    
    case 'interviewCoach':
      return tierConfig.limits.interviewCoach;
    
    case 'advancedTemplates':
      return tierConfig.limits.advancedTemplates;
    
    case 'aiCredits': {
      // Check if user has remaining credits
      const available = user.aiCredits + user.aiCreditsPurchased - user.aiCreditsUsed;
      return available > 0;
    }
    
    default:
      return false;
  }
}

export async function consumeAICredit(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiCredits: true,
      aiCreditsUsed: true,
      aiCreditsPurchased: true,
      subscriptionTier: true,
    },
  });

  if (!user) return false;

  const available = user.aiCredits + user.aiCreditsPurchased - user.aiCreditsUsed;
  
  // For unlimited tier (PREMIUM), don't consume
  if (user.subscriptionTier === SubscriptionTier.PREMIUM) {
    return true;
  }

  if (available <= 0) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiCreditsUsed: { increment: 1 },
    },
  });

  return true;
}

// ============================================
// BILLING HELPERS
// ============================================

export async function getUserBillingInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      aiCredits: true,
      aiCreditsUsed: true,
      aiCreditsPurchased: true,
    },
  });

  if (!user) return null;

  const availableCredits = user.aiCredits + user.aiCreditsPurchased - user.aiCreditsUsed;
  const tierConfig = TIER_CONFIG[user.subscriptionTier as SubscriptionTier];

  let subscription = null;
  if (user.stripeSubscriptionId) {
    subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
  }

  return {
    customerId: user.stripeCustomerId,
    subscriptionId: user.stripeSubscriptionId,
    tier: user.subscriptionTier,
    tierName: tierConfig?.name,
    status: user.subscriptionStatus,
    currentPeriodEnd: user.subscriptionEndsAt,
    subscription,
    credits: {
      total: user.aiCredits + user.aiCreditsPurchased,
      used: user.aiCreditsUsed,
      available: Math.max(0, availableCredits),
      purchased: user.aiCreditsPurchased,
    },
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function getPriceIdForTier(
  tier: SubscriptionTier,
  interval: 'monthly' | 'annual'
): string | null {
  switch (tier) {
    case SubscriptionTier.PRO:
      return interval === 'monthly' ? STRIPE_PRICES.PRO_MONTHLY : STRIPE_PRICES.PRO_ANNUAL;
    case SubscriptionTier.PREMIUM:
      return interval === 'monthly' ? STRIPE_PRICES.PREMIUM_MONTHLY : STRIPE_PRICES.PREMIUM_ANNUAL;
    default:
      return null;
  }
}