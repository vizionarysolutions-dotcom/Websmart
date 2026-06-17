import { Search, Filter, MessageCircle, UserPlus, TrendingUp } from "lucide-react";

export default function WorkflowPipeline() {
  const stages = [
    {
      icon: Search,
      title: "Scan",
      description: "AI-powered talent discovery",
      color: "primary"
    },
    {
      icon: Filter,
      title: "Screen", 
      description: "Automated qualification",
      color: "accent"
    },
    {
      icon: MessageCircle,
      title: "Interview",
      description: "Smart scheduling system",
      color: "secondary"
    },
    {
      icon: UserPlus,
      title: "Onboard",
      description: "Seamless integration",
      color: "primary"
    },
    {
      icon: TrendingUp,
      title: "Manage",
      description: "Performance tracking",
      color: "accent"
    }
  ];

  return (
    <div className="mt-20">
      <h3 className="text-2xl font-bold text-center mb-12">
        <span className="gradient-text">Recruitment Pipeline</span>
      </h3>
      
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
        {stages.map((stage, index) => (
          <div 
            key={index}
            className="workflow-stage feature-card rounded-lg p-6 text-center min-w-[160px]"
            data-testid={`stage-${stage.title.toLowerCase()}`}
          >
            <div className={`w-12 h-12 rounded-full bg-${stage.color}/20 flex items-center justify-center mx-auto mb-3`}>
              <stage.icon className={`w-6 h-6 text-${stage.color}`} />
            </div>
            <h4 className="font-semibold text-foreground mb-1">{stage.title}</h4>
            <p className="text-xs text-muted-foreground">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
