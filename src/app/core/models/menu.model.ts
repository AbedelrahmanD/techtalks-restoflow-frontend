export interface CurrencyDto {
    id: number;
    code: string;
    symbol: string;
    name: string;
}

export interface RestaurantSettingsDto {
    currency: CurrencyDto;
    restaurantName: string;
    logoUrl: string;
}

export interface MenuItemDto {
    id: number;
    name: string;
    price: number;
    image: string | null;
}

export interface MenuCategoryDto {
    id: number;
    name: string;
    image: string;
    items: MenuItemDto[];
}

export interface MenuResponseDto {
    settings: RestaurantSettingsDto;
    menu: MenuCategoryDto[];
}
