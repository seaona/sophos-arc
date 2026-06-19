export type Milestone = {
  id: string;
  title: string;
  achieved: boolean;
  achievedAt?: string;
  month?: number;
  weight: number;
  notes?: string;
};

export type Goal = {
  id: string;
  title: string;
  year: number;
  createdAt: string;
  type: 'habit' | 'finance' | 'health' | 'personal' | 'custom';

  habitIds?: string[];
  milestones?: Milestone[];
  itemWeights?: {
    [itemId: string]: number;
  };
};