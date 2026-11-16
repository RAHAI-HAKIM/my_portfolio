import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { z } from "astro/zod";

// Paths are resolved from the project root, where astro dev and build run.
const raw = parse(readFileSync(resolve("src/data/profile.yaml"), "utf8"));

const schema = z.object({
  showPlaceholders: z.boolean(),
  name: z.string(),
  displayName: z.string(),
  title: z.string(),
  focus: z.string(),
  positioning: z.string(),
  location: z.string(),
  status: z.array(z.string()),
  about: z.string().nullable(),
  portrait: z.string().nullable(),
  email: z.string().email(),
  links: z.object({ github: z.string().url(), linkedin: z.string().url() }),
  cv: z.object({ en: z.string(), fr: z.string() }),
  analyticsToken: z.string().nullable(),
  leadership: z.array(
    z.object({
      period: z.string(),
      role: z.string(),
      org: z.string().nullable(),
      lines: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string().nullable(),
      period: z.string(),
      note: z.string(),
      grades: z.array(z.object({ label: z.string(), value: z.number(), grade: z.string() })),
    }),
  ),
  skills: z.array(
    z.object({
      group: z.string(),
      items: z.array(z.object({ name: z.string(), projects: z.array(z.string()) })),
    }),
  ),
  interests: z.string().nullable(),
});

// Fails the build with a readable error when profile.yaml drifts from the schema.
export const profile = schema.parse(raw);

const inPublic = (path: string) => existsSync(resolve("public", `.${path}`));

/** CV links that actually exist in /public, so a button never leads to a 404. */
export const cv = {
  en: inPublic(profile.cv.en) ? profile.cv.en : null,
  fr: inPublic(profile.cv.fr) ? profile.cv.fr : null,
};

export const statusLabel: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  complete: "Complete",
  private: "Private",
  "repo-coming": "Repo coming",
};
