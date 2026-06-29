import { useState } from 'react';
import type { HealthMetric, HealthLog } from '../../types/health';

type Props = {
  metric: HealthMetric;
  latestLog?: HealthLog;
  onSave: (value: any) => void;
  onDelete?: (metricId: string) => void;
  isFilled?: boolean;
};

export default function MetricLogCard({ 
  metric, 
  latestLog, 
  onSave, 
  onDelete,
  isFilled = false 
}: Props) {
  const [value, setValue] = useState<any>(
    latestLog?.value ?? (metric.inputType === 'blood_pressure' ? { systolic: '', diastolic: '' } : '')
  );

  const handleSave = () => {
    if (isFilled) return; // Prevent saving if already logged

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
    <div className={`glass-card p-5 transition-all ${isFilled ? 'bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{metric.name}</h3>
          {isFilled && (
            <span className="text-emerald-500 text-lg" title="Already logged">✓</span>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(metric.id)}
            className="text-zinc-400 hover:text-red-500 p-1"
            title="Delete entire metric"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Input - Disabled when already filled */}
      {metric.inputType === 'blood_pressure' ? (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Systolic"
            value={(value as any).systolic || ''}
            onChange={(e) => setValue({ ...(value as any), systolic: e.target.value })}
            className="modern-input w-1/2"
            disabled={isFilled}
          />
          <input
            type="number"
            placeholder="Diastolic"
            value={(value as any).diastolic || ''}
            onChange={(e) => setValue({ ...(value as any), diastolic: e.target.value })}
            className="modern-input w-1/2"
            disabled={isFilled}
          />
        </div>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="modern-input w-full"
          disabled={isFilled}
        />
      )}

      {/* Save Button - Disabled + clear message when filled */}
      <button 
        onClick={handleSave} 
        disabled={isFilled}
        className="modern-button w-full mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isFilled ? "Already logged" : "Save"}
      </button>

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