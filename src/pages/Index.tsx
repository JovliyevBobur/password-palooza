import PasswordChecker from "@/components/PasswordChecker";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen py-12 px-4">
      {/* Header */}
      <header className="text-center mb-8 fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Shield size={18} />
          <span className="text-sm font-semibold">Security First</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
          Password<span className="text-primary"> Guardian</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Check your password strength and generate super-secure passwords with your friendly helper!
        </p>
      </header>

      {/* Main content */}
      <PasswordChecker />

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-20 w-24 h-24 bg-accent/15 rounded-full blur-2xl pointer-events-none" />
    </main>
  );
};

export default Index;
