export type CricketMatchStatus = "draft" | "in-progress" | "completed";

export type CricketPlayer = {
  id: string;
  workspaceId: string;
  displayName: string;
};

export type CricketMatch = {
  id: string;
  workspaceId: string;
  title: string;
  playedAt: string;
  status: CricketMatchStatus;
};

export type CricketScoreEntry = {
  id: string;
  matchId: string;
  playerId: string;
  runs: number;
  ballsFaced: number;
  wickets: number;
  oversBowled: number;
};
