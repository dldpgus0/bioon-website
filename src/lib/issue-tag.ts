import type { Issue } from "@/lib/content";

/** "#5" for weekly issues. The welcome letter is unnumbered (number 0), so it gets a name instead. */
export function issueTag(issue: Pick<Issue, "slug" | "number" | "lang">) {
  if (issue.slug !== "welcome") return `#${issue.number}`;
  return issue.lang === "ko" ? "웰컴 레터" : "Welcome letter";
}
