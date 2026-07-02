import { useLocalStorage } from './useLocalStorage';
import type { Supplement } from '../types/health';

export function useSupplements() {
  const [supplements, setSupplements] = useLocalStorage<Supplement[]>(
    'health-supplements',
    []
  );

  const addSupplement = (name: string, startDate: string, endDate?: string) => {
    const newSupplement: Supplement = {
      id: crypto.randomUUID(),
      name: name.trim(),
      startDate,
      endDate: endDate || undefined,
      createdAt: new Date().toISOString(),
    };
    setSupplements((prev) => [...prev, newSupplement]);
  };

  const updateSupplement = (id: string, updates: Partial<Supplement>) => {
    setSupplements((prev) =>
      prev.map((supp) =>
        supp.id === id ? { ...supp, ...updates } : supp
      )
    );
  };

  const deleteSupplement = (id: string) => {
    setSupplements((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    supplements,
    addSupplement,
    updateSupplement,
    deleteSupplement,
  };
}