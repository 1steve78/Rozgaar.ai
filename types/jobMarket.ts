export type TrendType = "up" | "down" | "neutral";

export type BulletinType =
  | "TRENDING_ROLE"
  | "SKILL"
  | "SPIKE"
  | "SLOWDOWN";

export interface JobMarketItem {
  id: number;
  type: BulletinType;
  title: string;
  description: string;
  trend: TrendType;
  updatedAt: string;
}
