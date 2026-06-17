import { Award, Cog, GraduationCap, Calendar } from "lucide-react";

export default function TalentPanel() {
  const features = [
    {
      icon: Award,
      title: "Experience",
      description: "Years and expertise level"
    },
    {
      icon: Cog,
      title: "Skills",
      description: "Technical competencies"
    },
    {
      icon: GraduationCap,
      title: "Background",
      description: "Education and history"
    },
    {
      icon: Calendar,
      title: "Availability",
      description: "Start date and schedule"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Talent Icon and Title */}
      <div className="text-center lg:text-right mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 border border-secondary/30 mb-4">
          <Award className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-secondary">TALENT</h2>
        <p className="text-muted-foreground">Discover Perfect Matches</p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="feature-card rounded-lg p-4 flex items-center space-x-4"
            data-testid={`card-${feature.title.toLowerCase()}`}
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-secondary" />
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
