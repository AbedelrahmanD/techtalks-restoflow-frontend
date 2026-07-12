import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsCreateDto, SettingsDto, SettingsSaveResponse } from '../models/settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private http = inject(HttpClient);

    getSettings(): Observable<SettingsDto> {
        return this.http.get<SettingsDto>('/api/Settings');
    }

    saveSettings(payload: SettingsCreateDto): Observable<SettingsSaveResponse> {
        const formData = new FormData();


        formData.append('CurrencyId', payload.currencyId.toString());
        formData.append('RestaurantName', payload.restaurantName);


        if (payload.logo) {
            formData.append('Logo', payload.logo);
        }

        return this.http.post<SettingsSaveResponse>('/api/Settings', formData);
    }
}
