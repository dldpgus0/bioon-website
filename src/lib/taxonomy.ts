import taxonomy from "@/content/taxonomy.json";

// Topic and role vocabulary used by the AI issue analysis. Safe to import in client components.
export type TopicId = keyof typeof taxonomy.topics;
export type RoleId = keyof typeof taxonomy.roles;

export const topicIds = Object.keys(taxonomy.topics) as TopicId[];
export const roleIds = Object.keys(taxonomy.roles) as RoleId[];

export const topicLabel = (id: TopicId, lang: string) => taxonomy.topics[id][lang === "ko" ? "ko" : "en"];
export const roleLabel = (id: RoleId, lang: string) => taxonomy.roles[id][lang === "ko" ? "ko" : "en"];
