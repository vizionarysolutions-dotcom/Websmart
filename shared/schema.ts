import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const businessProfiles = pgTable("business_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  teamSize: integer("team_size").notNull(),
  budget: integer("budget").notNull(),
  requirements: json("requirements").$type<string[]>().default([]),
  createdAt: text("created_at").default(sql`now()`),
});

export const jobPositions = pgTable("job_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessProfileId: varchar("business_profile_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  requirements: json("requirements").$type<string[]>().default([]),
  skills: json("skills").$type<string[]>().default([]),
  experienceLevel: text("experience_level").notNull(),
  location: text("location").notNull(),
  salaryRange: text("salary_range"),
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at").default(sql`now()`),
});

export const talentProfiles = pgTable("talent_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  skills: json("skills").$type<string[]>().default([]),
  experience: integer("experience").notNull(),
  education: text("education"),
  location: text("location").notNull(),
  availability: text("availability").notNull(),
  portfolio: text("portfolio"),
  createdAt: text("created_at").default(sql`now()`),
});

export const recruitmentPipelines = pgTable("recruitment_pipelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobPositionId: varchar("job_position_id").notNull(),
  talentProfileId: varchar("talent_profile_id").notNull(),
  stage: text("stage").notNull().default("scan"), // scan, screen, interview, onboard, manage
  status: text("status").notNull().default("active"), // active, completed, rejected
  notes: text("notes"),
  scheduledDate: text("scheduled_date"),
  updatedAt: text("updated_at").default(sql`now()`),
});

export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertJobPositionSchema = createInsertSchema(jobPositions).omit({
  id: true,
  createdAt: true,
});

export const insertTalentProfileSchema = createInsertSchema(talentProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertRecruitmentPipelineSchema = createInsertSchema(recruitmentPipelines).omit({
  id: true,
  updatedAt: true,
});

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
export type JobPosition = typeof jobPositions.$inferSelect;
export type InsertJobPosition = z.infer<typeof insertJobPositionSchema>;
export type TalentProfile = typeof talentProfiles.$inferSelect;
export type InsertTalentProfile = z.infer<typeof insertTalentProfileSchema>;
export type RecruitmentPipeline = typeof recruitmentPipelines.$inferSelect;
export type InsertRecruitmentPipeline = z.infer<typeof insertRecruitmentPipelineSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Relations
export const businessProfilesRelations = relations(businessProfiles, ({ many }) => ({
  jobPositions: many(jobPositions),
}));

export const jobPositionsRelations = relations(jobPositions, ({ one, many }) => ({
  businessProfile: one(businessProfiles, {
    fields: [jobPositions.businessProfileId],
    references: [businessProfiles.id],
  }),
  recruitmentPipelines: many(recruitmentPipelines),
}));

export const talentProfilesRelations = relations(talentProfiles, ({ many }) => ({
  recruitmentPipelines: many(recruitmentPipelines),
}));

export const recruitmentPipelinesRelations = relations(recruitmentPipelines, ({ one }) => ({
  jobPosition: one(jobPositions, {
    fields: [recruitmentPipelines.jobPositionId],
    references: [jobPositions.id],
  }),
  talentProfile: one(talentProfiles, {
    fields: [recruitmentPipelines.talentProfileId],
    references: [talentProfiles.id],
  }),
}));
