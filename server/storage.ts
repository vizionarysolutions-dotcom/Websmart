import { 
  type BusinessProfile, 
  type InsertBusinessProfile,
  type JobPosition,
  type InsertJobPosition,
  type TalentProfile,
  type InsertTalentProfile,
  type RecruitmentPipeline,
  type InsertRecruitmentPipeline,
  type User, 
  type InsertUser,
  businessProfiles,
  jobPositions,
  talentProfiles,
  recruitmentPipelines,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { emailService } from "./email";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Business Profile methods
  createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile>;
  getBusinessProfile(id: string): Promise<BusinessProfile | undefined>;
  getAllBusinessProfiles(): Promise<BusinessProfile[]>;
  updateBusinessProfile(id: string, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile | undefined>;

  // Job Position methods
  createJobPosition(position: InsertJobPosition): Promise<JobPosition>;
  getJobPosition(id: string): Promise<JobPosition | undefined>;
  getJobPositionsByBusinessProfile(businessProfileId: string): Promise<JobPosition[]>;
  getAllJobPositions(): Promise<JobPosition[]>;
  updateJobPosition(id: string, updates: Partial<InsertJobPosition>): Promise<JobPosition | undefined>;

  // Talent Profile methods
  createTalentProfile(profile: InsertTalentProfile): Promise<TalentProfile>;
  getTalentProfile(id: string): Promise<TalentProfile | undefined>;
  getAllTalentProfiles(): Promise<TalentProfile[]>;
  updateTalentProfile(id: string, updates: Partial<InsertTalentProfile>): Promise<TalentProfile | undefined>;

  // Recruitment Pipeline methods
  createRecruitmentPipeline(pipeline: InsertRecruitmentPipeline): Promise<RecruitmentPipeline>;
  getRecruitmentPipeline(id: string): Promise<RecruitmentPipeline | undefined>;
  getRecruitmentPipelinesByJobPosition(jobPositionId: string): Promise<RecruitmentPipeline[]>;
  updateRecruitmentPipeline(id: string, updates: Partial<InsertRecruitmentPipeline>): Promise<RecruitmentPipeline | undefined>;
  getAllRecruitmentPipelines(): Promise<RecruitmentPipeline[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Business Profile methods
  async createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile> {
    const [businessProfile] = await db
      .insert(businessProfiles)
      .values(profile)
      .returning();
    
    // Send email notification
    await emailService.notifyBusinessProfileCreated(businessProfile);
    
    return businessProfile;
  }

  async getBusinessProfile(id: string): Promise<BusinessProfile | undefined> {
    const [profile] = await db.select().from(businessProfiles).where(eq(businessProfiles.id, id));
    return profile || undefined;
  }

  async getAllBusinessProfiles(): Promise<BusinessProfile[]> {
    return await db.select().from(businessProfiles);
  }

  async updateBusinessProfile(id: string, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile | undefined> {
    const [updated] = await db
      .update(businessProfiles)
      .set(updates)
      .where(eq(businessProfiles.id, id))
      .returning();
    return updated || undefined;
  }

  // Job Position methods
  async createJobPosition(position: InsertJobPosition): Promise<JobPosition> {
    const [jobPosition] = await db
      .insert(jobPositions)
      .values(position)
      .returning();
    
    // Get business profile for email notification
    const businessProfile = await this.getBusinessProfile(position.businessProfileId);
    if (businessProfile) {
      await emailService.notifyNewJobPosition(jobPosition, businessProfile);
    }
    
    return jobPosition;
  }

  async getJobPosition(id: string): Promise<JobPosition | undefined> {
    const [position] = await db.select().from(jobPositions).where(eq(jobPositions.id, id));
    return position || undefined;
  }

  async getJobPositionsByBusinessProfile(businessProfileId: string): Promise<JobPosition[]> {
    return await db
      .select()
      .from(jobPositions)
      .where(eq(jobPositions.businessProfileId, businessProfileId));
  }

  async getAllJobPositions(): Promise<JobPosition[]> {
    return await db.select().from(jobPositions);
  }

  async updateJobPosition(id: string, updates: Partial<InsertJobPosition>): Promise<JobPosition | undefined> {
    const [updated] = await db
      .update(jobPositions)
      .set(updates)
      .where(eq(jobPositions.id, id))
      .returning();
    return updated || undefined;
  }

  // Talent Profile methods
  async createTalentProfile(profile: InsertTalentProfile): Promise<TalentProfile> {
    const [talentProfile] = await db
      .insert(talentProfiles)
      .values(profile)
      .returning();
    
    // Send email notification
    await emailService.notifyNewTalentProfile(talentProfile);
    
    return talentProfile;
  }

  async getTalentProfile(id: string): Promise<TalentProfile | undefined> {
    const [profile] = await db.select().from(talentProfiles).where(eq(talentProfiles.id, id));
    return profile || undefined;
  }

  async getAllTalentProfiles(): Promise<TalentProfile[]> {
    return await db.select().from(talentProfiles);
  }

  async updateTalentProfile(id: string, updates: Partial<InsertTalentProfile>): Promise<TalentProfile | undefined> {
    const [updated] = await db
      .update(talentProfiles)
      .set(updates)
      .where(eq(talentProfiles.id, id))
      .returning();
    return updated || undefined;
  }

  // Recruitment Pipeline methods
  async createRecruitmentPipeline(pipeline: InsertRecruitmentPipeline): Promise<RecruitmentPipeline> {
    const [recruitmentPipeline] = await db
      .insert(recruitmentPipelines)
      .values(pipeline)
      .returning();
    
    // Get related data for email notification
    const [talent, job] = await Promise.all([
      this.getTalentProfile(pipeline.talentProfileId),
      this.getJobPosition(pipeline.jobPositionId)
    ]);
    
    if (talent && job) {
      const business = await this.getBusinessProfile(job.businessProfileId);
      if (business) {
        await emailService.notifyPipelineStatusChange(recruitmentPipeline, talent, job, business);
      }
    }
    
    return recruitmentPipeline;
  }

  async getRecruitmentPipeline(id: string): Promise<RecruitmentPipeline | undefined> {
    const [pipeline] = await db.select().from(recruitmentPipelines).where(eq(recruitmentPipelines.id, id));
    return pipeline || undefined;
  }

  async getRecruitmentPipelinesByJobPosition(jobPositionId: string): Promise<RecruitmentPipeline[]> {
    return await db
      .select()
      .from(recruitmentPipelines)
      .where(eq(recruitmentPipelines.jobPositionId, jobPositionId));
  }

  async updateRecruitmentPipeline(id: string, updates: Partial<InsertRecruitmentPipeline>): Promise<RecruitmentPipeline | undefined> {
    // Get the current pipeline to track changes
    const currentPipeline = await this.getRecruitmentPipeline(id);
    const oldStage = currentPipeline?.stage;
    
    const [updated] = await db
      .update(recruitmentPipelines)
      .set(updates)
      .where(eq(recruitmentPipelines.id, id))
      .returning();
    
    // Send email notification if stage changed
    if (updated && updates.stage && oldStage !== updates.stage) {
      const [talent, job] = await Promise.all([
        this.getTalentProfile(updated.talentProfileId),
        this.getJobPosition(updated.jobPositionId)
      ]);
      
      if (talent && job) {
        const business = await this.getBusinessProfile(job.businessProfileId);
        if (business) {
          await emailService.notifyPipelineStatusChange(updated, talent, job, business, oldStage);
        }
      }
    }
    
    return updated || undefined;
  }

  async getAllRecruitmentPipelines(): Promise<RecruitmentPipeline[]> {
    return await db.select().from(recruitmentPipelines);
  }
}

export const storage = new DatabaseStorage();
