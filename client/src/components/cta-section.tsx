import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CTASection() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/business-profile");
  };

  const handleScheduleDemo = () => {
    // TODO: Implement demo scheduling
    console.log("Schedule demo clicked");
  };

  return (
    <div className="text-center mt-20">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold">Ready to Transform Your Hiring?</h3>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of businesses using smart contracts to streamline their recruitment process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleGetStarted}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors glow-effect"
            data-testid="button-get-started"
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline"
            onClick={handleScheduleDemo}
            className="px-8 py-3 border border-border hover:bg-card text-foreground rounded-lg font-semibold transition-colors"
            data-testid="button-schedule-demo"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
