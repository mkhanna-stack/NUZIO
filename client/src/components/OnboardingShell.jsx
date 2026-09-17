import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 6;

export default function OnboardingShell({ step, eyebrow, title, titleAccent, subtitle, children, onSkip, hideProgress }) {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col px-6 pt-6 pb-8 max-w-md mx-auto">
      {!hideProgress && (
        <div className="relative z-10 flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 rounded-full bg-base-700 overflow-hidden flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 rounded-full transition-colors ${
                  i < step ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-base-700'
                }`}
              />
            ))}
          </div>
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs tracking-wide text-white/40 hover:text-white/70 transition-colors focus-ring rounded"
            >
              Skip
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        {eyebrow && <p className="text-xs text-violet-400 mb-2">{eyebrow}</p>}
        {title && (
          <h1 className="font-display text-[28px] leading-tight mb-1">
            {title}
            {titleAccent && <span className="block italic text-violet-400">{titleAccent}</span>}
          </h1>
        )}
        {subtitle && <p className="text-sm text-white/50 mb-8 max-w-[30ch]">{subtitle}</p>}

        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
