import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, OrderDto } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);

  listOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>('/api/Order');
  }

  getCurrentTableOrder(qrCodeToken: string): Observable<OrderDto | null> {
    return this.http.get<OrderDto | null>(`/api/Order/table/${qrCodeToken}`);
  }

  createOrder(payload: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>('/api/Order', payload);
  }

  updateStatus(id: number, status: string): Observable<OrderDto> {
    return this.http.put<OrderDto>(`/api/Order/${id}/status`, { status });
  }
}
