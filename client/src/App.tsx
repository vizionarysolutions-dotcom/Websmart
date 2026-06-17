import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BusinessProfile from "@/pages/business-profile";
import RecruitmentDashboard from "@/pages/recruitment-dashboard";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-50"></div>
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/business-profile" component={BusinessProfile} />
          <Route path="/dashboard" component={RecruitmentDashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
