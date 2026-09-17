import { useAuth } from '../../context/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    sub: '/mo',
    blurb: '5 article summaries per day, ad-supported, push notifications.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹79',
    sub: '/mo',
    blurb: 'Unlimited custom briefings, premium voices, multi-language support.',
    badge: 'LAUNCH OFFER',
    highlight: true,
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: '₹1,499',
    sub: '/yr',
    blurb: 'All Pro benefits, offline mode, and no features locked away.',
  },
];

export default function Billing() {
  const { profile, updateProfile } = useAuth();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl mb-1">Plan & billing</h1>
      <p className="text-xs text-white/40 mb-6">Start free. Upgrade when mornings pay for themselves.</p>

      <div className="space-y-3">
        {PLANS.map((plan) => {
          const active = profile?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`card p-4 ${plan.highlight ? 'border-mint-500/60 bg-mint-500/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{plan.name}</span>
                {plan.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint-500/15 text-mint-400">{plan.badge}</span>
                )}
              </div>
              <p className="mb-2">
                <span className="text-xl font-display">{plan.price}</span>
                <span className="text-xs text-white/40">{plan.sub}</span>
              </p>
              <p className="text-xs text-white/40 mb-4">{plan.blurb}</p>

              {active ? (
                <button disabled className="w-full py-2.5 rounded-lg text-xs font-medium bg-base-700 text-white/50">
                  Current plan
                </button>
              ) : plan.highlight ? (
                <button
                  onClick={() => updateProfile({ plan: plan.id })}
                  className="w-full py-2.5 rounded-lg text-xs font-medium bg-mint-500 text-base-950 focus-ring"
                >
                  Upgrade to Pro
                </button>
              ) : (
                <button
                  onClick={() => updateProfile({ plan: plan.id })}
                  className="w-full py-2.5 rounded-lg text-xs font-medium border border-white/15 text-white/70 focus-ring"
                >
                  Switch to {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
