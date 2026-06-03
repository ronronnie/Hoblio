import type { CricketScoreEntry } from "@/modules/cricket/types";

export function calculateStrikeRate(entry: Pick<CricketScoreEntry, "runs" | "ballsFaced">) {
  if (entry.ballsFaced === 0) return 0;
  return Number(((entry.runs / entry.ballsFaced) * 100).toFixed(2));
}

export function calculatePlayerRuns(entries: CricketScoreEntry[], playerId: string) {
  return entries
    .filter((entry) => entry.playerId === playerId)
    .reduce((total, entry) => total + entry.runs, 0);
}
