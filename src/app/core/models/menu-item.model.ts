export interface MenuItemCreateDto {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  image?: File;
}

export interface MenuItemUpdateDto {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  image?: File;
}

export interface MenuItemDto {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}
