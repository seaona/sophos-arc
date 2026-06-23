import { useState } from 'react';
import type { HealthMetric, HealthLog } from '../../types/health';

type Props = {
  metric: HealthMetric;
  latestLog?: HealthLog;
  onSave: (value: any) => void;
};

export default function MetricLogCard({ metric, latestLog, onSave }: Props) {
  const [value, setValue] = useState<any>(
    latestLog?.value ?? (metric.inputType === 'blood_pressure' ? { systolic: '', diastolic: '' } : '')
  );

  const handleSave = () => {
    if (metric.inputType === 'blood_pressure') {
      const bp = value as { systolic: string | number; diastolic: string | number };
      if (!bp.systolic || !bp.diastolic) return;
      onSave({
        systolic: Number(bp.systolic),
        diastolic: Number(bp.diastolic),
      });
    } else {
      if (value === '' || value === null) return;
      onSave(Number(value));
    }
  };

  const displayValue = () => {
    if (!latestLog) return null;

    if (metric.inputType === 'blood_pressure' && typeof latestLog.value === 'object') {
      const bp = latestLog.value as { systolic: number; diastolic: number };
      return `${bp.systolic}/${bp.diastolic}`;
    }
    return `${latestLog.value}${metric.unit ? ` ${metric.unit}` : ''}`;
  };

  return (
    <div className="glass-card p-5">
      <div className="mb-3">
        <h3 className="font-semibold">{metric.name}</h3>
        {metric.unit && <span className="text-xs text-zinc-500 ml-1">({metric.unit})</span>}
      </div>

      {/* Input based on type */}
      {metric.inputType === 'blood_pressure' ? (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Systolic"
            value={(value as any).systolic || ''}
            onChange={(e) =>
              setValue({ ...(value as any), systolic: e.target.value })
            }
            className="modern-input w-1/2"
          />
          <input
            type="number"
            placeholder="Diastolic"
            value={(value as any).diastolic || ''}
            onChange={(e) =>
              setValue({ ...(value as any), diastolic: e.target.value })
            }
            className="modern-input w-1/2"
          />
        </div>
      ) : (
        <input
          type="number"
          min={metric.inputType === 'scale_1_10' ? 1 : undefined}
          max={metric.inputType === 'scale_1_10' ? 10 : undefined}
          step={metric.inputType === 'scale_1_10' ? 1 : 0.1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={metric.inputType === 'scale_1_10' ? '1 - 10' : ''}
          className="modern-input w-full"
        />
      )}

      <button
        onClick={handleSave}
        className="modern-button w-full mt-3"
      >
        Save
      </button>

      {latestLog && (
        <div className="text-xs text-zinc-500 mt-2 text-center">
          Last logged: <span className="font-medium">{displayValue()}</span>
        </div>
      )}
    </div>
  );
}