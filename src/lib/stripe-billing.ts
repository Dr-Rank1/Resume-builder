// ============================================
// STRIPE BILLING SYSTEM
// Enterprise-grade subscription and payment management
// ============================================

import Stripe from 'stripe';

// ============================================
// STRIPE CLIENT
// ============================================

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// ============================================
// SUBSCRIPTION TIERS
// ============================================

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Create up to 3 resumes',
      'Basic templates',
      'Manual bullet suggestions',
      'PDF export',
      'JSON export/import',
    ],
    limits: {
      resumes: 3,
      aiCredits: 0,
      aiGenerations: 0,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 1499, // $14.99/month in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Unlimited resumes',
      'All premium templates',
      'AI bullet generation (50/month)',
      'AI summary generation',
      'Job description parsing',
      'ATS matching (basic)',
      'Priority support',
      'No watermarks',
    ],
    limits: {
      resumes: -1, // Unlimited
      aiCredits: 50,
      aiGenerations: 50,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 2999, // $29.99/month in cents
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    features: [
      'Everything in Pro',
      'Advanced ATS matching with recommendations',
      'AI interview coach',
      'Unlimited AI generations',
      'Recruiter portal access',
      'Analytics dashboard',
      'Career insights report',
      'LinkedIn optimization',
      '1-on-1 support',
    ],
    limits: {
      resumes: -1,
      aiCredits: -1, // Unlimited
      aiGenerations: -1,
    },
  },
} as const;

export type TierId = keyof typeof SUBSCRIPTION_TIERS;

// ============================================
// USER SESSION MANAGEMENT
// ============================================

interface UserSession {
  userId: string;
  customerId: string;
  subscriptionId: string;
  tier: TierId;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// ============================================
// CHECKOUT SESSION CREATION
// ============================================

export interface CreateCheckoutParams {
  userId: string;
  email: string;
  tierId: TierId;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  userId,
  email,
  tierId,
  successUrl,
  cancelUrl,
}: CreateCheckoutParams): Promise<Stripe.Checkout.Session> {
  const tier = SUBSCRIPTION_TIERS[tierId];

  if (!tier.priceId) {
    throw new Error(`Tier ${tierId} does not have a price ID configured`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: tier.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      tierId,
    },
    subscription_data: {
      metadata: {
        userId,
        tierId,
      },
    },
  });

  return session;
}

// ============================================
// CUSTOMER PORTAL
// ============================================

export interface CreatePortalParams {
  customerId: string;
  returnUrl: string;
}

export async function createCustomerPortal({
  customerId,
  returnUrl,
}: CreatePortalParams): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  if (atPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

export async function updateSubscription(
  subscriptionId: string,
  newTierId: TierId
): Promise<Stripe.Subscription> {
  const newTier = SUBSCRIPTION_TIERS[newTierId];

  if (!newTier.priceId) {
    throw new Error(`Tier ${newTierId} does not have a price ID`);
  }

  // Get current subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update the price
  const itemId = subscription.items.data[0].id;

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: itemId,
        price: newTier.priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

// ============================================
// USAGE TRACKING (AI Credits)
// ============================================

export interface UsageRecord {
  userId: string;
  feature: 'bullet_generation' | 'summary_generation' | 'ats_matching' | 'interview_coach';
  tokensUsed: number;
  costCents: number;
  timestamp: Date;
}

// Simple in-memory usage tracking (would use Redis in production)
const usageTracker = new Map<string, UsageRecord[]>();

export function recordUsage(record: UsageRecord): void {
  const key = `${record.userId}:${new Date().toISOString().slice(0, 7)}`; // Monthly key
  const existing = usageTracker.get(key) || [];
  existing.push(record);
  usageTracker.set(key, existing);
}

export function getMonthlyUsage(userId: string): UsageRecord[] {
  const key = `${userId}:${new Date().toISOString().slice(0, 7)}`;
  return usageTracker.get(key) || [];
}

export function getMonthlyCost(userId: string): number {
  const usage = getMonthlyUsage(userId);
  return usage.reduce((sum, record) => sum + record.costCents, 0);
}

// ============================================
// WEBHOOK HANDLING
// ============================================

export interface WebhookHandler {
  // Returns true if the event was handled successfully
  handleEvent(event: Stripe.Event): Promise<boolean>;
}

export const webhookHandlers: Record<string, WebhookHandler['handleEvent']> = {
  'checkout.session.completed': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const tierId = session.metadata?.tierId;

    if (!userId || !tierId) {
      console.error('Missing metadata in checkout session');
      return false;
    }

    // TODO: Update user's subscription in database
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionTier: tierId,
    //     subscriptionStatus: 'active',
    //     customerId: session.customer as string,
    //     subscriptionId: session.subscription as string,
    //   },
    // });

    console.log(`Subscription activated for user ${userId}: ${tierId}`);
    return true;
  },

  'customer.subscription.updated': async (event) => {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return false;
    }

    // TODO: Update subscription status in database
    console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
    return true;
  },

  'customer.subscription.deleted': async (event) => {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return false;
    }

    // TODO: Downgrade user to free tier
    console.log(`Subscription canceled for user ${userId}`);
    return true;
  },

  'invoice.payment_failed': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    // TODO: Send email notification about failed payment
    console.log(`Payment failed for customer ${customerId}`);
    return true;
  },

  'invoice.payment_succeeded': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    console.log(`Payment succeeded for customer ${customerId}`);
    return true;
  },
};

export async function handleWebhook(
  payload: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return { success: false, error: 'Webhook secret not configured' };
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return { success: false, error: 'Webhook signature verification failed' };
  }

  const handler = webhookHandlers[event.type];

  if (!handler) {
    return { success: true }; // Event type not handled, but not an error
  }

  try {
    const handled = await handler(event);
    return { success: handled };
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return { success: false, error: 'Handler execution failed' };
  }
}

// ============================================
// SUBSCRIPTION STATUS CHECK
// ============================================

export function getSubscriptionStatus(
  status: Stripe.Subscription.Status
): UserSession['status'] {
  const statusMap: Record<Stripe.Subscription.Status, UserSession['status']> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
    incomplete: 'past_due',
    incomplete_expired: 'canceled',
    paused: 'active', // Treat paused as still active
  };

  return statusMap[status] || 'canceled';
}

export function canUseFeature(tierId: TierId, feature: keyof typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS]['limits']): boolean {
  const tier = SUBSCRIPTION_TIERS[tierId];
  
  if (!tier) return false;
  
  const limit = tier.limits[feature];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  // 0 means not available
  if (limit === 0) return false;
  
  // For limited features, would need to check actual usage
  // For now, assume if limit > 0, feature is available
  return true;
}

export function getTierForFeature(feature: keyof typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS]['limits']): TierId {
  const featureMap: Record<keyof typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS]['limits'], TierId> = {
    resumes: 'free', // Basic resume creation available to all
    aiCredits: 'pro', // AI features start at Pro
    aiGenerations: 'pro',
  };

  return featureMap[feature] || 'free';
}

// ============================================
// EXPORTS
// ============================================

export const BillingSystem = {
  createCheckoutSession,
  createCustomerPortal,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  recordUsage,
  getMonthlyUsage,
  getMonthlyCost,
  handleWebhook,
  getSubscriptionStatus,
  canUseFeature,
  getTierForFeature,
};

export default BillingSystem;