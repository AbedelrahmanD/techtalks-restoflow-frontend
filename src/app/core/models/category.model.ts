export interface CategoryCreateDto {
    name: string;
    isActive: boolean;
    image?: File;
}

export interface CategoryUpdateDto {
    name: string;
    isActive: boolean;
    image?: File;
}

export interface CategoryDto {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
}
