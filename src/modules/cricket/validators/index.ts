import type { CricketScoreEntry } from "@/modules/cricket/types";

export function validateScoreEntry(entry: CricketScoreEntry) {
  const errors: string[] = [];

  if (entry.runs < 0) errors.push("Runs cannot be negative.");
  if (entry.ballsFaced < 0) errors.push("Balls faced cannot be negative.");
  if (entry.wickets < 0) errors.push("Wickets cannot be negative.");
  if (entry.oversBowled < 0) errors.push("Overs bowled cannot be negative.");

  return {
    valid: errors.length === 0,
    errors
  };
}
