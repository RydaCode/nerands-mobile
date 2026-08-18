export interface Category {
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    image: string | null;
    is_active: boolean | null;
    platform_category_id: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface CategoriesResponse {
    data: Category[];
}