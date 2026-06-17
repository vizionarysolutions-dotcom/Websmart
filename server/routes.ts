import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBusinessProfileSchema,
  insertJobPositionSchema,
  insertTalentProfileSchema,
  insertRecruitmentPipelineSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Business Profile routes
  app.post("/api/business-profiles", async (req, res) => {
    try {
      const validatedData = insertBusinessProfileSchema.parse(req.body);
      const profile = await storage.createBusinessProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid business profile data", error });
    }
  });

  app.get("/api/business-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllBusinessProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business profiles", error });
    }
  });

  app.get("/api/business-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getBusinessProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business profile", error });
    }
  });

  app.patch("/api/business-profiles/:id", async (req, res) => {
    try {
      const updates = insertBusinessProfileSchema.partial().parse(req.body);
      const profile = await storage.updateBusinessProfile(req.params.id, updates);
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error });
    }
  });

  // Job Position routes
  app.post("/api/job-positions", async (req, res) => {
    try {
      const validatedData = insertJobPositionSchema.parse(req.body);
      const position = await storage.createJobPosition(validatedData);
      res.json(position);
    } catch (error) {
      res.status(400).json({ message: "Invalid job position data", error });
    }
  });

  app.get("/api/job-positions", async (req, res) => {
    try {
      const { businessProfileId } = req.query;
      let positions;
      
      if (businessProfileId) {
        positions = await storage.getJobPositionsByBusinessProfile(businessProfileId as string);
      } else {
        positions = await storage.getAllJobPositions();
      }
      
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job positions", error });
    }
  });

  app.get("/api/job-positions/:id", async (req, res) => {
    try {
      const position = await storage.getJobPosition(req.params.id);
      if (!position) {
        return res.status(404).json({ message: "Job position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job position", error });
    }
  });

  app.patch("/api/job-positions/:id", async (req, res) => {
    try {
      const updates = insertJobPositionSchema.partial().parse(req.body);
      const position = await storage.updateJobPosition(req.params.id, updates);
      if (!position) {
        return res.status(404).json({ message: "Job position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error });
    }
  });

  // Talent Profile routes
  app.post("/api/talent-profiles", async (req, res) => {
    try {
      const validatedData = insertTalentProfileSchema.parse(req.body);
      const profile = await storage.createTalentProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid talent profile data", error });
    }
  });

  app.get("/api/talent-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllTalentProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch talent profiles", error });
    }
  });

  app.get("/api/talent-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getTalentProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Talent profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch talent profile", error });
    }
  });

  // Recruitment Pipeline routes
  app.post("/api/recruitment-pipelines", async (req, res) => {
    try {
      const validatedData = insertRecruitmentPipelineSchema.parse(req.body);
      const pipeline = await storage.createRecruitmentPipeline(validatedData);
      res.json(pipeline);
    } catch (error) {
      res.status(400).json({ message: "Invalid recruitment pipeline data", error });
    }
  });

  app.get("/api/recruitment-pipelines", async (req, res) => {
    try {
      const { jobPositionId } = req.query;
      let pipelines;
      
      if (jobPositionId) {
        pipelines = await storage.getRecruitmentPipelinesByJobPosition(jobPositionId as string);
      } else {
        pipelines = await storage.getAllRecruitmentPipelines();
      }
      
      res.json(pipelines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recruitment pipelines", error });
    }
  });

  app.patch("/api/recruitment-pipelines/:id", async (req, res) => {
    try {
      const updates = insertRecruitmentPipelineSchema.partial().parse(req.body);
      const pipeline = await storage.updateRecruitmentPipeline(req.params.id, updates);
      if (!pipeline) {
        return res.status(404).json({ message: "Recruitment pipeline not found" });
      }
      res.json(pipeline);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
