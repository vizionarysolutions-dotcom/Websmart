import BusinessPanel from "@/components/business-panel";
import TalentPanel from "@/components/talent-panel";
import CenterHub from "@/components/center-hub";
import WorkflowPipeline from "@/components/workflow-pipeline";
import CTASection from "@/components/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">SMART</span> 
            <span className="text-foreground ml-2">CONTRACTS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent Business Solutions for Modern Recruitment
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-20">
          
          {/* Left Side - Business Features */}
          <BusinessPanel />

          {/* Center - Main Icon and Connecting Lines */}
          <CenterHub />

          {/* Right Side - Talent Features */}
          <TalentPanel />
        </div>

        {/* Workflow Pipeline Section */}
        <WorkflowPipeline />

        {/* Call to Action */}
        <CTASection />
      </div>
    </div>
  );
}
