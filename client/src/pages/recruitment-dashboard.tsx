import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Users, Briefcase, TrendingUp, Plus } from "lucide-react";
import { useLocation } from "wouter";
import type { BusinessProfile, JobPosition, RecruitmentPipeline } from "@shared/schema";

export default function RecruitmentDashboard() {
  const [, setLocation] = useLocation();

  const { data: businessProfiles, isLoading: profilesLoading } = useQuery<BusinessProfile[]>({
    queryKey: ["/api/business-profiles"],
  });

  const { data: jobPositions, isLoading: positionsLoading } = useQuery<JobPosition[]>({
    queryKey: ["/api/job-positions"],
  });

  const { data: pipelines, isLoading: pipelinesLoading } = useQuery<RecruitmentPipeline[]>({
    queryKey: ["/api/recruitment-pipelines"],
  });

  const isLoading = profilesLoading || positionsLoading || pipelinesLoading;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "scan": return "bg-blue-500/20 text-blue-400";
      case "screen": return "bg-purple-500/20 text-purple-400";
      case "interview": return "bg-orange-500/20 text-orange-400";
      case "onboard": return "bg-green-500/20 text-green-400";
      case "manage": return "bg-cyan-500/20 text-cyan-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    businessProfiles: businessProfiles?.length || 0,
    activePositions: jobPositions?.filter(p => p.isActive)?.length || 0,
    totalCandidates: pipelines?.length || 0,
    activeRecruitments: pipelines?.filter(p => p.status === "active")?.length || 0,
  };

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Recruitment <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your recruitment pipeline and track progress
            </p>
          </div>
          <Button
            onClick={() => setLocation("/business-profile")}
            className="glow-effect"
            data-testid="button-create-profile"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Profiles</p>
                  <p className="text-2xl font-bold" data-testid="stat-business-profiles">
                    {stats.businessProfiles}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Positions</p>
                  <p className="text-2xl font-bold" data-testid="stat-active-positions">
                    {stats.activePositions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold" data-testid="stat-total-candidates">
                    {stats.totalCandidates}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Recruitments</p>
                  <p className="text-2xl font-bold" data-testid="stat-active-recruitments">
                    {stats.activeRecruitments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Business Profiles */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Business Profiles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {businessProfiles && businessProfiles.length > 0 ? (
                <div className="space-y-4">
                  {businessProfiles.map((profile) => (
                    <div 
                      key={profile.id}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      data-testid={`profile-${profile.id}`}
                    >
                      <h4 className="font-semibold text-foreground">{profile.companyName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{profile.industry} • {profile.location}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Team: {profile.teamSize}</span>
                        <span>Budget: ${profile.budget?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No business profiles yet</p>
                  <p className="text-sm">Create your first profile to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Recruitments */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Active Recruitments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelines && pipelines.length > 0 ? (
                <div className="space-y-4">
                  {pipelines.filter(p => p.status === "active").map((pipeline) => {
                    const position = jobPositions?.find(j => j.id === pipeline.jobPositionId);
                    return (
                      <div 
                        key={pipeline.id}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                        data-testid={`pipeline-${pipeline.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {position?.title || "Unknown Position"}
                          </h4>
                          <Badge className={getStageColor(pipeline.stage)}>
                            {pipeline.stage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Talent ID: {pipeline.talentProfileId}
                        </p>
                        {pipeline.scheduledDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Scheduled: {new Date(pipeline.scheduledDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active recruitments</p>
                  <p className="text-sm">Start by creating job positions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
