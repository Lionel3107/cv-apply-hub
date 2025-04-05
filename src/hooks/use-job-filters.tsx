
import { useState } from 'react';

type JobFilters = {
  category: string;
  type: string;
  location: string;
  isRemote: boolean | null;
};

export const useJobFilters = () => {
  const [filters, setFilters] = useState<JobFilters>({
    category: '',
    type: '',
    location: '',
    isRemote: null,
  });

  const setFilter = (key: keyof JobFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      type: '',
      location: '',
      isRemote: null,
    });
  };

  return {
    filters,
    setFilter,
    resetFilters,
  };
};
