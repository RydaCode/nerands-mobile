// hooks/useProductCategoryTabs.js

import { useEffect } from "react";
import useApi from "../hook/useApi";

const useProductCategoryTabs = (business_id, store_id) => {

    const {
        data,
        isLoading,
        error,
        get
    } = useApi();

    useEffect(() => {

        if (business_id && store_id) {
            get(
                `/stores/product/categories/${store_id}/${business_id}`
            );
        }

    }, [business_id, store_id]);

    const tabs = [
        {
            id: null,
            name: "All"
        },

        ...(data?.categories ?? []).map(category => ({
            id: category.id,
            name: category.name
        }))
    ];

    return {
        tabs,
        isLoading,
        error
    };
};

export default useProductCategoryTabs;