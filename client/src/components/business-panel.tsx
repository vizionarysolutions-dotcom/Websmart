import { Briefcase, MapPin, DollarSign, Users } from "lucide-react";

export default function BusinessPanel() {
  const features = [
    {
      icon: Briefcase,
      title: "Job Requirements",
      description: "Define role specifications"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Set geographic preferences"
    },
    {
      icon: DollarSign,
      title: "Budget",
      description: "Define compensation range"
    },
    {
      icon: Users,
      title: "Team Size",
      description: "Specify headcount needs"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Business Icon and Title */}
      <div className="text-center lg:text-left mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary">BUSINESS</h2>
        <p className="text-muted-foreground">Define Your Requirements</p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="feature-card rounded-lg p-4 flex items-center space-x-4"
            data-testid={`card-${feature.title.toLowerCase().replace(' ', '-')}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
