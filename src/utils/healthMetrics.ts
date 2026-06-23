// utils/healthMetrics.ts (or we can put this inside the hook for now)

export const DEFAULT_HEALTH_METRICS: HealthMetric[] = [
  {
    id: 'resting-heart-rate',
    name: 'Resting Heart Rate',
    unit: 'bpm',
    frequency: 'daily',
    inputType: 'number',
    category: 'vitals',
    isActive: true,
  },
  {
    id: 'weight',
    name: 'Weight',
    unit: 'kg',
    frequency: 'weekly',
    inputType: 'number',
    category: 'body',
    isActive: true,
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure',
    unit: 'mmHg',
    frequency: 'weekly',
    inputType: 'blood_pressure',
    category: 'vitals',
    isActive: true,
  },
  {
    id: 'sleep-quality',
    name: 'Sleep Quality',
    frequency: 'daily',
    inputType: 'scale_1_10',
    category: 'subjective',
    isActive: true,
  },
  {
    id: 'sleep-duration',
    name: 'Sleep Duration',
    unit: 'hours',
    frequency: 'daily',
    inputType: 'number',
    category: 'subjective',
    isActive: true,
  },
];