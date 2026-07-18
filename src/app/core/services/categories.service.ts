import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryCreateDto, CategoryDto, CategoryUpdateDto } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private http = inject(HttpClient);

    categories = signal<CategoryDto[]>([]);

    listCategories(): Observable<CategoryDto[]> {
        return this.http.get<CategoryDto[]>('/api/Category');
    }

    getCategory(id: number | string): Observable<CategoryDto> {
        return this.http.get<CategoryDto>(`/api/Category/${id}`);
    }

    createCategory(payload: CategoryCreateDto): Observable<CategoryDto> {
        return this.http.post<CategoryDto>('/api/Category', this.toFormData(payload));
    }

    updateCategory(id: number | string, payload: CategoryUpdateDto): Observable<void> {
        return this.http.put<void>(`/api/Category/${id}`, this.toFormData(payload));
    }

    deleteCategory(id: number | string): Observable<void> {
        return this.http.delete<void>(`/api/Category/${id}`);
    }

    private toFormData(payload: CategoryCreateDto | CategoryUpdateDto): FormData {
        const formData = new FormData();

        formData.append('Name', payload.name);
        formData.append('IsActive', String(payload.isActive));

        if (payload.image) {
            formData.append('Image', payload.image);
        }

        return formData;
    }
}
