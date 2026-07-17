import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DiningTableCreateDto,
  DiningTableDto,
  DiningTableUpdateDto,
} from '../models/dining-table.model';

@Injectable({
  providedIn: 'root',
})
export class DiningTablesService {
  private http = inject(HttpClient);

  tables = signal<DiningTableDto[]>([]);

  listTables(): Observable<DiningTableDto[]> {
    return this.http.get<DiningTableDto[]>('/api/DiningTable');
  }

  getTable(id: number | string): Observable<DiningTableDto> {
    return this.http.get<DiningTableDto>(`/api/DiningTable/${id}`);
  }

  createTable(payload: DiningTableCreateDto): Observable<DiningTableDto> {
    return this.http.post<DiningTableDto>('/api/DiningTable', payload);
  }

  updateTable(id: number | string, payload: DiningTableUpdateDto): Observable<void> {
    return this.http.put<void>(`/api/DiningTable/${id}`, payload);
  }

  deleteTable(id: number | string): Observable<void> {
    return this.http.delete<void>(`/api/DiningTable/${id}`);
  }
}
