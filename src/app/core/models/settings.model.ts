import { CurrencyDto } from './currency.model';

export interface SettingsDto {
    id: number;
    currency: CurrencyDto;
    restaurantName: string;
    logoUrl: string;
}

export interface SettingsCreateDto {
    currencyId: number;
    restaurantName: string;
    logo?: File;
}


export interface SettingsSaveResponse {
    message: string;
    settings: SettingsDto

}

