
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  name: string;
  count: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .rpc('get_job_count_by_category');

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data to match our Category type
        const transformedCategories = data.map((category) => ({
          name: category.category,
          count: Number(category.count),
        }));

        setCategories(transformedCategories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
