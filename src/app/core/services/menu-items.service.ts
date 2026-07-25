import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItemCreateDto, MenuItemDto, MenuItemUpdateDto } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  private http = inject(HttpClient);

  menuItems = signal<MenuItemDto[]>([]);

  listMenuItems(): Observable<MenuItemDto[]> {
    return this.http.get<MenuItemDto[]>('/api/MenuItems');
  }

  getMenuItem(id: number | string): Observable<MenuItemDto> {
    return this.http.get<MenuItemDto>(`/api/MenuItems/${id}`);
  }

  createMenuItem(payload: MenuItemCreateDto): Observable<MenuItemDto> {
    return this.http.post<MenuItemDto>('/api/MenuItems', this.toFormData(payload));
  }

  updateMenuItem(id: number | string, payload: MenuItemUpdateDto): Observable<void> {
    return this.http.put<void>(`/api/MenuItems/${id}`, this.toFormData(payload));
  }

  deleteMenuItem(id: number | string): Observable<void> {
    return this.http.delete<void>(`/api/MenuItems/${id}`);
  }

  private toFormData(payload: MenuItemCreateDto | MenuItemUpdateDto): FormData {
    const formData = new FormData();

    formData.append('CategoryId', String(payload.categoryId));
    formData.append('Name', payload.name);
    formData.append('Price', String(payload.price));
    formData.append('IsActive', String(payload.isActive));

    if (payload.description) {
      formData.append('Description', payload.description);
    }

    if (payload.image) {
      formData.append('Image', payload.image);
    }

    return formData;
  }
}
