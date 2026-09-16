import Stripe from 'stripe';

declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      charge?: string | Charge | null;
    }
    
    interface Charge {
      payment_intent?: string;
    }
    
    interface CheckoutSession {
      payment_intent: string;
      invoice?: string;
    }
  }
}

export {};