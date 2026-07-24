import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { OrderDto } from '../models/order.model';

@Injectable({
    providedIn: 'root',
})
export class KitchenOrdersRealtimeService {
    private kitchenConnection?: signalR.HubConnection;

    orders = signal<OrderDto[]>([]);

    connect(): void {
        this.ensureConnection();
        this.startConnectionAndJoinKitchen();
    }

    disconnect(): void {
        this.kitchenConnection?.stop();
        this.kitchenConnection = undefined;
    }

    private ensureConnection(): void {
        if (this.kitchenConnection) {
            return;
        }

        this.kitchenConnection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/orders')
            .withAutomaticReconnect()
            .build();

        this.kitchenConnection.on('OrderUpdated', (updated: OrderDto) => {
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
    }

    private startConnectionAndJoinKitchen(): void {
        if (!this.kitchenConnection || this.kitchenConnection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        this.kitchenConnection.start()
            .then(async () => {
                await this.kitchenConnection?.invoke('JoinKitchenGroup');
            })
            .catch((err) => {
                console.error('SignalR kitchen connection error:', err);
            });
    }
}