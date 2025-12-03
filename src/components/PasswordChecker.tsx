import { useState, useCallback } from "react";
import { Eye, EyeOff, Copy, RefreshCw, Check, Type, Hash, Asterisk, ArrowRight, Settings2, Zap, KeyRound, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Mascot from "./Mascot";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type Preset = "custom" | "pin" | "memorable" | "ultra";

const presets = [
  { id: "custom" as Preset, name: "Custom", icon: Settings2, description: "Your settings" },
  { id: "pin" as Preset, name: "PIN", icon: KeyRound, description: "4-8 digits" },
  { id: "memorable" as Preset, name: "Memorable", icon: MessageSquare, description: "Easy to remember" },
  { id: "ultra" as Preset, name: "Ultra Secure", icon: Zap, description: "Maximum security" },
];

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Generation options
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [activePreset, setActivePreset] = useState<Preset>("custom");

  // Apply preset
  const applyPreset = (preset: Preset) => {
    setActivePreset(preset);
    switch (preset) {
      case "pin":
        setLength(6);
        setIncludeLowercase(false);
        setIncludeUppercase(false);
        setIncludeNumbers(true);
        setIncludeSymbols(false);
        break;
      case "memorable":
        setLength(12);
        setIncludeLowercase(true);
        setIncludeUppercase(true);
        setIncludeNumbers(true);
        setIncludeSymbols(false);
        break;
      case "ultra":
        setLength(24);
        setIncludeLowercase(true);
        setIncludeUppercase(true);
        setIncludeNumbers(true);
        setIncludeSymbols(true);
        break;
      case "custom":
      default:
        break;
    }
  };

  // Calculate password strength
  const calculateStrength = useCallback((pass: string) => {
    if (!pass) return 0;

    let strength = 0;
    const len = pass.length;

    // Length contribution (up to 30%)
    strength += Math.min(len * 3, 30);

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

    let charset = "";
    let generated = "";

    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      toast({
        title: "Oops! 😅",
        description: "Please enable at least one character type.",
        variant: "destructive",
      });
      return;
    }

    // Ensure at least one of each selected type
    if (includeLowercase) generated += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (includeUppercase) generated += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (includeNumbers) generated += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) generated += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest
    const remaining = length - generated.length;
    for (let i = 0; i < remaining; i++) {
      generated += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle
    generated = generated
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generated);
    toast({
      title: "Password Generated! 🎉",
      description: `Created a ${length}-character password for you.`,
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

        {/* Options toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed transition-all duration-300",
            showOptions
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          <Settings2 size={18} />
          <span className="font-medium">{showOptions ? "Hide Options" : "Customize Generator"}</span>
        </button>

        {/* Generation options */}
        {showOptions && (
          <div className="space-y-5 p-5 rounded-2xl bg-muted/50 border border-border fade-in-up">
            {/* Presets */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
                      activePreset === preset.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-card hover:bg-card/80 text-foreground"
                    )}
                  >
                    <preset.icon size={18} />
                    <div className="text-left">
                      <div className="text-sm font-semibold">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Length</label>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {length} characters
                </span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => {
                  setLength(value[0]);
                  setActivePreset("custom");
                }}
                min={4}
                max={32}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>32</span>
              </div>
            </div>

            {/* Character type toggles */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Character Types</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <Type size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Lowercase (a-z)</span>
                  </div>
                  <Switch
                    checked={includeLowercase}
                    onCheckedChange={(checked) => {
                      setIncludeLowercase(checked);
                      setActivePreset("custom");
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <Type size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Uppercase (A-Z)</span>
                  </div>
                  <Switch
                    checked={includeUppercase}
                    onCheckedChange={(checked) => {
                      setIncludeUppercase(checked);
                      setActivePreset("custom");
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <Hash size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Numbers (0-9)</span>
                  </div>
                  <Switch
                    checked={includeNumbers}
                    onCheckedChange={(checked) => {
                      setIncludeNumbers(checked);
                      setActivePreset("custom");
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <Asterisk size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Symbols (!@#$%)</span>
                  </div>
                  <Switch
                    checked={includeSymbols}
                    onCheckedChange={(checked) => {
                      setIncludeSymbols(checked);
                      setActivePreset("custom");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
