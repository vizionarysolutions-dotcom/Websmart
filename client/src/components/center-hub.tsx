import { FileText } from "lucide-react";

export default function CenterHub() {
  return (
    <div className="flex items-center justify-center relative">
      {/* Dotted Lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        {/* Left Line */}
        <line 
          x1="0" 
          y1="50%" 
          x2="25%" 
          y2="50%" 
          stroke="hsl(220, 30%, 30%)" 
          strokeWidth="2" 
          strokeDasharray="10,10"
          className="pulse-animation" 
        />
        {/* Right Line */}
        <line 
          x1="75%" 
          y1="50%" 
          x2="100%" 
          y2="50%" 
          stroke="hsl(220, 30%, 30%)" 
          strokeWidth="2" 
          strokeDasharray="10,10"
          className="pulse-animation" 
        />
      </svg>

      {/* Central Icon */}
      <div className="center-icon w-24 h-24 rounded-2xl flex items-center justify-center glow-effect">
        <FileText className="w-12 h-12 text-white" />
      </div>
    </div>
  );
}
