export type HealthMetric = {
  id: string;
  name: string;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  inputType: 'number' | 'scale_1_10' | 'blood_pressure';
  category: 'vitals' | 'body' | 'subjective' | 'biomarkers';
  description?: string;
  isActive: boolean;
};

export type HealthLog = {
  id: string;
  metricId: string;
  value: number | { systolic: number; diastolic: number };
  date: string;           // Format: "2026-06-21"
  notes?: string;
};

export type Supplement = {
  id: string;
  name: string;
  startDate: string;
  frequency?: string;
  quantity?: string;
  endDate?: string;
  createdAt: string;
};