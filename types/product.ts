export interface ProductImage {
    id: string;
    image_url: string;
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    primary_image: ProductImage | null;
    images: ProductImage[];
    category: ProductCategory | null;
    sku: string;
    ingredients: string | null;
    is_active: boolean;
    already_exists: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductsPagination {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductsResponse {
    success: boolean;
    data: ProductsPagination;
}