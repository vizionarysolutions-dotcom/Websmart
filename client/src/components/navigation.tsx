import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, Users, BarChart3 } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Building },
    { href: "/business-profile", label: "Business Profile", icon: Building },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">SMART CONTRACTS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                    data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
