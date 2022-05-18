
import React, { useEffect, useState } from 'react'
import cafeApi from '../api/cafeApi';
import { Categoria, CategoriesResponse } from '../interface/appInterfaces';

const useCategories = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Categoria[]>([]);

    useEffect(() => {
        getCategories();
    }, [])

    const getCategories = async () => {
        const resp = await cafeApi.get<CategoriesResponse>('/categorias');
        setCategories(resp.data.categorias);
        setIsLoading(false);
    }

    return {
        isLoading,
        categories
    }
}

export default useCategories
