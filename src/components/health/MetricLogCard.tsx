import { useState } from 'react';
import type { HealthMetric, HealthLog } from '../../types/health';

type Props = {
  metric: HealthMetric;
  latestLog?: HealthLog;
  onSave: (value: any) => void;
  onDelete: (metricId: string, logId?: string) => void; // updated
  isCustomMetric?: boolean;
};

export default function MetricLogCard({ 
  metric, 
  latestLog, 
  onSave, 
  onDelete,
  isCustomMetric = false 
}: Props) {
  const [value, setValue] = useState<any>(
    latestLog?.value ?? (metric.inputType === 'blood_pressure' ? { systolic: '', diastolic: '' } : '')
  );

  const handleSave = () => {
    if (metric.inputType === 'blood_pressure') {
      const bp = value as { systolic: string | number; diastolic: string | number };
      if (!bp.systolic || !bp.diastolic) return;
      onSave({ systolic: Number(bp.systolic), diastolic: Number(bp.diastolic) });
    } else {
      if (value === '' || value === null) return;
      onSave(Number(value));
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{metric.name}</h3>
          {metric.unit && <span className="text-xs text-zinc-500">({metric.unit})</span>}
        </div>

        {/* Delete icon always visible */}
        <button
          onClick={() => onDelete(metric.id, latestLog?.id)}
          className="text-zinc-400 hover:text-red-500 p-1"
          title={isCustomMetric ? "Delete metric" : "Delete last entry"}
        >
          🗑️
        </button>
      </div>

      {/* Input fields remain the same */}
      {metric.inputType === 'blood_pressure' ? (
        <div className="flex gap-2">
          <input type="number" placeholder="Systolic" value={(value as any).systolic || ''} 
                 onChange={(e) => setValue({ ...(value as any), systolic: e.target.value })} className="modern-input w-1/2" />
          <input type="number" placeholder="Diastolic" value={(value as any).diastolic || ''} 
                 onChange={(e) => setValue({ ...(value as any), diastolic: e.target.value })} className="modern-input w-1/2" />
        </div>
      ) : (
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="modern-input w-full" />
      )}

      <button onClick={handleSave} className="modern-button w-full mt-3">Save</button>

      {latestLog && (
        <div className="text-xs text-zinc-500 mt-2 text-center">
          Last: <span className="font-medium">
            {typeof latestLog.value === 'object' 
              ? `${latestLog.value.systolic}/${latestLog.value.diastolic}` 
              : latestLog.value}
          </span>
        </div>
      )}
    </div>
  );
}