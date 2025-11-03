// src/hooks/useRecipes.js
import { useQuery } from '@tanstack/react-query';
import recipeService from '../services/recipeService';

/**
 * Hook untuk mengambil daftar resep
 */
export function useRecipes(params = {}) {
    const queryKey = ['recipes', params];

    const queryFn = async () => {
        const response = await recipeService.getRecipes(params);
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch recipes');
        }
        return response;
    };

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey,
        queryFn,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2, // cache valid 2 menit
        cacheTime: 1000 * 60 * 5, // disimpan di memori 5 menit
    });

    return {
        recipes: data?.data || [],
        pagination: data?.pagination || null,
        loading: isLoading,
        error: isError ? 'Gagal memuat data resep' : null,
        refetch,
    };
}

/**
 * Hook untuk mengambil satu resep berdasarkan ID
 */
export function useRecipe(id) {
    const queryKey = ['recipe', id];

    const queryFn = async () => {
        if (!id) return null;
        const response = await recipeService.getRecipeById(id);
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch recipe');
        }
        return response.data;
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey,
        queryFn,
        enabled: !!id,
        staleTime: 1000 * 60 * 2,
    });

    return {
        recipe: data,
        loading: isLoading,
        error: isError ? 'Gagal memuat data resep' : null,
        refetch,
    };
}
