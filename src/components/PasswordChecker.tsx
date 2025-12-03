import { useState, useCallback } from "react";
import { Eye, EyeOff, Copy, RefreshCw, Check, Type, Hash, Asterisk, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Mascot from "./Mascot";
import { toast } from "@/hooks/use-toast";

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate password strength
  const calculateStrength = useCallback((pass: string) => {
    if (!pass) return 0;

    let strength = 0;
    const length = pass.length;

    // Length contribution (up to 30%)
    strength += Math.min(length * 3, 30);

    // Character variety (up to 70%)
    if (/[a-z]/.test(pass)) strength += 15;
    if (/[A-Z]/.test(pass)) strength += 15;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 20;

    return Math.min(strength, 100);
  }, []);

  const strength = calculateStrength(password);

  // Check individual requirements
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  // Get strength color
  const getStrengthColor = () => {
    if (strength < 25) return "bg-destructive";
    if (strength < 50) return "bg-warning";
    if (strength < 75) return "bg-secondary";
    return "bg-success";
  };

  const getStrengthLabel = () => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong!";
  };

  // Generate strong password
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const all = lowercase + uppercase + numbers + symbols;

    let generated = "";
    // Ensure at least one of each type
    generated += lowercase[Math.floor(Math.random() * lowercase.length)];
    generated += uppercase[Math.floor(Math.random() * uppercase.length)];
    generated += numbers[Math.floor(Math.random() * numbers.length)];
    generated += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest
    for (let i = 0; i < 12; i++) {
      generated += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle
    generated = generated
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generated);
    toast({
      title: "Password Generated! 🎉",
      description: "A strong password has been created for you.",
    });
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Copied! 📋",
      description: "Password copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto fade-in-up">
      {/* Mascot */}
      <div className="mb-8">
        <Mascot strength={strength} />
      </div>

      {/* Main card */}
      <div className="glass-card p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Password Checker</h2>
          <p className="text-muted-foreground text-sm">
            Create a strong password to keep your accounts safe!
          </p>
        </div>

        {/* Password input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password..."
            className="input-glossy pr-24"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className={cn(
                "p-2 rounded-xl transition-colors",
                password
                  ? "hover:bg-muted text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/40 cursor-not-allowed"
              )}
              aria-label="Copy password"
            >
              {copied ? <Check size={20} className="text-success" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Strength meter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Password Strength</span>
            <span
              className={cn(
                "text-sm font-bold transition-colors",
                strength < 25 && "text-destructive",
                strength >= 25 && strength < 50 && "text-warning",
                strength >= 50 && strength < 75 && "text-secondary-foreground",
                strength >= 75 && "text-success"
              )}
            >
              {strength}% - {getStrengthLabel()}
            </span>
          </div>
          <div className="strength-meter">
            <div
              className={cn("strength-fill", getStrengthColor())}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn("requirement-badge", hasMinLength ? "met" : "unmet")}>
            <ArrowRight size={16} />
            <span>8+ chars</span>
          </div>
          <div className={cn("requirement-badge", hasUppercase ? "met" : "unmet")}>
            <Type size={16} />
            <span>Uppercase</span>
          </div>
          <div className={cn("requirement-badge", hasLowercase ? "met" : "unmet")}>
            <Type size={16} className="lowercase" />
            <span>Lowercase</span>
          </div>
          <div className={cn("requirement-badge", hasNumbers ? "met" : "unmet")}>
            <Hash size={16} />
            <span>Numbers</span>
          </div>
          <div className={cn("requirement-badge col-span-2 justify-center", hasSymbols ? "met" : "unmet")}>
            <Asterisk size={16} />
            <span>Special Characters (!@#$%)</span>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generatePassword}
          className="glossy-button w-full py-4 text-primary-foreground flex items-center justify-center gap-3 text-lg"
        >
          <RefreshCw size={22} />
          <span>Generate Strong Password</span>
        </button>
      </div>

      {/* Footer tip */}
      <p className="text-center text-muted-foreground text-sm mt-6 px-4">
        💡 Tip: Use a unique password for each account and store them in a password manager!
      </p>
    </div>
  );
};

export default PasswordChecker;
