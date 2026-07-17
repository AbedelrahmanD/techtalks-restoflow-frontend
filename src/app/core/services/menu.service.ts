import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuResponseDto } from '../models/menu.model';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private http = inject(HttpClient);

    getMenu(): Observable<MenuResponseDto> {
        return this.http.get<MenuResponseDto>('/api/Menu');
    }
}
