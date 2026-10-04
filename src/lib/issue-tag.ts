import type { Issue } from "@/lib/content";

/** "#5" for every issue; the welcome letter is #1. */
export function issueTag(issue: Pick<Issue, "number">) {
  return `#${issue.number}`;
}
