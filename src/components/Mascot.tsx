import { cn } from "@/lib/utils";

interface MascotProps {
  strength: number;
  className?: string;
}

const Mascot = ({ strength, className }: MascotProps) => {
  // Determine mascot mood based on strength
  const getMood = () => {
    if (strength < 25) return "worried";
    if (strength < 50) return "thinking";
    if (strength < 75) return "happy";
    return "excited";
  };

  const mood = getMood();

  // Eye expressions based on mood
  const getEyes = () => {
    switch (mood) {
      case "worried":
        return (
          <>
            {/* Worried eyes - raised eyebrows, concerned look */}
            <ellipse cx="38" cy="42" rx="8" ry="10" fill="hsl(20 30% 25%)" />
            <ellipse cx="62" cy="42" rx="8" ry="10" fill="hsl(20 30% 25%)" />
            <circle cx="40" cy="40" r="3" fill="white" />
            <circle cx="64" cy="40" r="3" fill="white" />
            {/* Worried eyebrows */}
            <path d="M28 32 Q38 28 48 34" stroke="hsl(20 30% 25%)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M52 34 Q62 28 72 32" stroke="hsl(20 30% 25%)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Thinking eyes - one eye squinting */}
            <ellipse cx="38" cy="42" rx="8" ry="10" fill="hsl(20 30% 25%)" />
            <ellipse cx="62" cy="42" rx="8" ry="6" fill="hsl(20 30% 25%)" />
            <circle cx="40" cy="40" r="3" fill="white" />
            <circle cx="64" cy="41" r="2" fill="white" />
          </>
        );
      case "happy":
        return (
          <>
            {/* Happy eyes - curved happy eyes */}
            <ellipse cx="38" cy="42" rx="8" ry="10" fill="hsl(20 30% 25%)" />
            <ellipse cx="62" cy="42" rx="8" ry="10" fill="hsl(20 30% 25%)" />
            <circle cx="40" cy="40" r="4" fill="white" />
            <circle cx="64" cy="40" r="4" fill="white" />
          </>
        );
      case "excited":
        return (
          <>
            {/* Excited eyes - sparkly big eyes */}
            <ellipse cx="38" cy="42" rx="10" ry="12" fill="hsl(20 30% 25%)" />
            <ellipse cx="62" cy="42" rx="10" ry="12" fill="hsl(20 30% 25%)" />
            <circle cx="41" cy="39" r="5" fill="white" />
            <circle cx="65" cy="39" r="5" fill="white" />
            <circle cx="36" cy="44" r="2" fill="white" opacity="0.6" />
            <circle cx="60" cy="44" r="2" fill="white" opacity="0.6" />
            {/* Sparkles */}
            <path d="M20 25 L22 30 L20 35 L18 30 Z" fill="hsl(45 95% 72%)" />
            <path d="M80 25 L82 30 L80 35 L78 30 Z" fill="hsl(45 95% 72%)" />
          </>
        );
      default:
        return null;
    }
  };

  // Mouth expressions
  const getMouth = () => {
    switch (mood) {
      case "worried":
        return (
          <path
            d="M40 68 Q50 62 60 68"
            stroke="hsl(20 30% 25%)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "thinking":
        return (
          <ellipse cx="55" cy="66" rx="6" ry="4" fill="hsl(20 30% 25%)" />
        );
      case "happy":
        return (
          <path
            d="M38 64 Q50 76 62 64"
            stroke="hsl(20 30% 25%)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "excited":
        return (
          <>
            <ellipse cx="50" cy="68" rx="12" ry="10" fill="hsl(20 30% 25%)" />
            <ellipse cx="50" cy="72" rx="8" ry="5" fill="hsl(350 80% 60%)" />
          </>
        );
      default:
        return null;
    }
  };

  // Cheeks (blush)
  const getCheeks = () => {
    const opacity = mood === "excited" ? 0.6 : mood === "happy" ? 0.4 : 0.2;
    return (
      <>
        <ellipse cx="24" cy="55" rx="8" ry="5" fill="hsl(350 80% 75%)" opacity={opacity} />
        <ellipse cx="76" cy="55" rx="8" ry="5" fill="hsl(350 80% 75%)" opacity={opacity} />
      </>
    );
  };

  return (
    <div className={cn("mascot-container", mood === "excited" ? "bounce-gentle" : "", className)}>
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "w-full h-full drop-shadow-lg transition-transform duration-300",
          mood === "worried" && "animate-pulse"
        )}
      >
        {/* Main body - cute blob shape */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(45, 95%, 85%)" />
            <stop offset="100%" stopColor="hsl(35, 90%, 75%)" />
          </linearGradient>
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="92" rx="30" ry="6" fill="hsl(20 30% 25%)" opacity="0.1" />

        {/* Body */}
        <ellipse
          cx="50"
          cy="55"
          rx="38"
          ry="40"
          fill="url(#bodyGradient)"
          filter="url(#shadow)"
        />

        {/* Body highlight */}
        <ellipse
          cx="50"
          cy="45"
          rx="30"
          ry="25"
          fill="url(#highlightGradient)"
        />

        {/* Cheeks */}
        {getCheeks()}

        {/* Eyes */}
        {getEyes()}

        {/* Mouth */}
        {getMouth()}

        {/* Small decorative elements for excited state */}
        {mood === "excited" && (
          <>
            <circle cx="15" cy="35" r="3" fill="hsl(350 80% 75%)" opacity="0.6" />
            <circle cx="85" cy="35" r="3" fill="hsl(160 45% 75%)" opacity="0.6" />
            <circle cx="10" cy="55" r="2" fill="hsl(45 95% 72%)" opacity="0.6" />
            <circle cx="90" cy="55" r="2" fill="hsl(45 95% 72%)" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Speech bubble */}
      <div
        className={cn(
          "absolute -top-2 -right-4 px-3 py-1.5 rounded-2xl text-xs font-bold",
          "bg-card border border-border shadow-lg transition-all duration-300",
          mood === "worried" && "bg-destructive/10 text-destructive",
          mood === "thinking" && "bg-warning/10 text-warning-foreground",
          mood === "happy" && "bg-secondary/30 text-secondary-foreground",
          mood === "excited" && "bg-success/20 text-success pulse-glow"
        )}
      >
        {mood === "worried" && "😰"}
        {mood === "thinking" && "🤔"}
        {mood === "happy" && "😊"}
        {mood === "excited" && "🎉"}
      </div>
    </div>
  );
};

export default Mascot;
