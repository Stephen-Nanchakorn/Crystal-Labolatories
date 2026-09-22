mkdir -p lib/stripe
cat > lib/stripe/config.ts << 'EOF'
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-08-26.dahlia",
});
EOF