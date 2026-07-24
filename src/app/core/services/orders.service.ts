import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { OrderDto } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private connection?: signalR.HubConnection;

  // Shared source of truth: both the initial REST load and every
  // real-time SignalR update write into this same signal.
  orders = signal<OrderDto[]>([]);

  listOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>('/api/Order');
  }

  updateStatus(id: number, status: string): Observable<OrderDto> {
    return this.http.put<OrderDto>(`/api/Order/${id}/status`, { status });
  }

  connect(): void {
    if (this.connection) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/orders')
      .withAutomaticReconnect()
      .build();

    this.connection.on('OrderUpdated', (updated: OrderDto) => {
      this.orders.update((orders) => {
        const index = orders.findIndex((o) => o.id === updated.id);

        if (index === -1) {
          return [...orders, updated];
        }

        const copy = [...orders];
        copy[index] = updated;
        return copy;
      });
    });

    this.connection.start().catch((err) => {
      console.error('SignalR connection error:', err);
    });
  }

  disconnect(): void {
    this.connection?.stop();
    this.connection = undefined;
  }
}
