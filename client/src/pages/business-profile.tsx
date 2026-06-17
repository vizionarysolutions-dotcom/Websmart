import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBusinessProfileSchema, type InsertBusinessProfile } from "@shared/schema";
import { Building, Users, MapPin, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education", 
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media",
  "Real Estate",
  "Other"
];

export default function BusinessProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBusinessProfile>({
    resolver: zodResolver(insertBusinessProfileSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      description: "",
      location: "",
      teamSize: 1,
      budget: 50000,
      requirements: []
    }
  });

  const createBusinessProfileMutation = useMutation({
    mutationFn: async (data: InsertBusinessProfile) => {
      const response = await apiRequest("POST", "/api/business-profiles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-profiles"] });
      toast({
        title: "Success",
        description: "Business profile created successfully!",
      });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create business profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBusinessProfile) => {
    createBusinessProfileMutation.mutate(data);
  };

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Create Your <span className="gradient-text">Business Profile</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your company and hiring needs
          </p>
        </div>

        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-6 h-6 text-primary" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  {...form.register("companyName")}
                  data-testid="input-company-name"
                />
                {form.formState.errors.companyName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.companyName.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => form.setValue("industry", value)}>
                  <SelectTrigger data-testid="select-industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.industry && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.industry.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your company and what you do"
                  rows={4}
                  {...form.register("description")}
                  data-testid="textarea-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    {...form.register("location")}
                    data-testid="input-location"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>

                {/* Team Size */}
                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Current Team Size</span>
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    placeholder="Number of employees"
                    {...form.register("teamSize", { valueAsNumber: true })}
                    data-testid="input-team-size"
                  />
                  {form.formState.errors.teamSize && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.teamSize.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Annual Hiring Budget (USD)</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Enter your annual hiring budget"
                  {...form.register("budget", { valueAsNumber: true })}
                  data-testid="input-budget"
                />
                {form.formState.errors.budget && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.budget.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createBusinessProfileMutation.isPending}
                  className="glow-effect"
                  data-testid="button-create-profile"
                >
                  {createBusinessProfileMutation.isPending ? "Creating..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
