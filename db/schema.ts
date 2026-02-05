import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

/* =====================================================
   USERS (Profile table, linked to auth.users)
   ===================================================== */

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // references auth.users.id
  fullName: text("full_name"),
  email: text("email").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

/* =====================================================
   SKILLS (Master skill list)
   ===================================================== */

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

/* =====================================================
   USERS ↔ SKILLS (Many-to-Many)
   ===================================================== */

export const usersSkills = pgTable(
  "users_skills",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),

    proficiency: integer("proficiency"), // 1–5
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.skillId] }),
  })
)

/* =====================================================
   JOB TYPE ENUM
   ===================================================== */

export const jobTypeEnum = pgEnum("job_type", [
  "internship",
  "full-time",
  "part-time",
  "contract",
])

/* =====================================================
   JOBS
   ===================================================== */

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),
  company: text('company'),
  location: text('location'),
  description: text('description'),

  jobType: jobTypeEnum('job_type'),

  source: text('source').notNull(),
  sourceUrl: text('source_url').notNull(),

  postedAt: timestamp('posted_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

/* =====================================================
   JOBS ↔ SKILLS (Many-to-Many)
   ===================================================== */

export const jobsSkills = pgTable(
  "jobs_skills",
  {
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),

    importance: integer("importance"), // 1–5
  },
  (table) => ({
    pk: primaryKey({ columns: [table.jobId, table.skillId] }),
  })
)

/* =====================================================
   RELATIONS
   ===================================================== */

export const usersRelations = relations(users, ({ many }) => ({
  skills: many(usersSkills),
}))

export const skillsRelations = relations(skills, ({ many }) => ({
  users: many(usersSkills),
  jobs: many(jobsSkills),
}))

export const usersSkillsRelations = relations(usersSkills, ({ one }) => ({
  user: one(users, {
    fields: [usersSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [usersSkills.skillId],
    references: [skills.id],
  }),
}))

export const jobsRelations = relations(jobs, ({ many }) => ({
  skills: many(jobsSkills),
}))

export const jobsSkillsRelations = relations(jobsSkills, ({ one }) => ({
  job: one(jobs, {
    fields: [jobsSkills.jobId],
    references: [jobs.id],
  }),
  skill: one(skills, {
    fields: [jobsSkills.skillId],
    references: [skills.id],
  }),
}))
