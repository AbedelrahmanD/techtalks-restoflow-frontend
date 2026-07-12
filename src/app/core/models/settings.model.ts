export interface SettingsDto {
    id?: number;
    currencyId?: number | null;
    restaurantName?: string | null;
    logoUrl?: string | null;
}

export interface SettingsCreateDto {
    currencyId: number;
    restaurantName: string;
    logo?: File | null;
}


export interface SettingsSaveResponse {
    message: string;
    settings: SettingsDto

}

