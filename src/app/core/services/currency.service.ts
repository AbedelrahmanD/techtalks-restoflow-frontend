import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyDto } from '../models/currency.model';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private http = inject(HttpClient);

    listCurrencies(): Observable<CurrencyDto[]> {
        return this.http.get<CurrencyDto[]>('/api/Currency');
    }
}
