
import { useState } from 'react';

type JobFilters = {
  category: string;
  type: string;
  location: string;
  isRemote: boolean | null;
  status?: string;
  datePosted?: string;
  featured?: boolean;
  searchTerm?: string;
};

export const useJobFilters = () => {
  const [filters, setFilters] = useState<JobFilters>({
    category: '',
    type: '',
    location: '',
    isRemote: null,
    status: '',
    datePosted: '',
    featured: undefined,
    searchTerm: '',
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
      status: '',
      datePosted: '',
      featured: undefined,
      searchTerm: '',
    });
  };

  return {
    filters,
    setFilter,
    resetFilters,
  };
};
