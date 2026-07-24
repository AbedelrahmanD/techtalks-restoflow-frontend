import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { OrderDto } from '../models/order.model';

@Injectable({
    providedIn: 'root',
})
export class MenuOrdersRealtimeService {
    private menuConnection?: signalR.HubConnection;
    private menuQrCodeToken: string | null = null;

    currentOrder = signal<OrderDto | null>(null);

    connect(qrCodeToken: string): void {
        if (!qrCodeToken) {
            return;
        }

        this.menuQrCodeToken = qrCodeToken;
        this.ensureConnection();
        this.startConnectionAndJoinTableGroup();
    }

    setCurrentOrder(order: OrderDto): void {
        this.currentOrder.set(order);
    }

    disconnect(): void {
        this.menuConnection?.stop();
        this.menuConnection = undefined;
        this.menuQrCodeToken = null;
        this.currentOrder.set(null);
    }

    private ensureConnection(): void {
        if (this.menuConnection) {
            return;
        }

        this.menuConnection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/orders')
            .withAutomaticReconnect()
            .build();

        this.menuConnection.on('OrderUpdated', (updated: OrderDto) => {
            const currentOrder = this.currentOrder();

            if (!currentOrder || updated.id !== currentOrder.id) {
                return;
            }

            if (updated.status === 'Paid' || updated.status === 'Voided') {
                this.currentOrder.set(null);
                return;
            }

            this.currentOrder.set({
                ...currentOrder,
                status: updated.status,
                updatedAt: updated.updatedAt,
            });
        });

        this.menuConnection.onreconnected(() => {
            this.joinTableGroup();
        });
    }

    private startConnectionAndJoinTableGroup(): void {
        if (!this.menuConnection) {
            return;
        }

        if (this.menuConnection.state === signalR.HubConnectionState.Connected) {
            this.joinTableGroup();
            return;
        }

        if (this.menuConnection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        this.menuConnection.start()
            .then(() => {
                this.joinTableGroup();
            })
            .catch((err) => {
                console.error('SignalR menu connection error:', err);
            });
    }

    private joinTableGroup(): void {
        if (!this.menuQrCodeToken) {
            return;
        }

        this.menuConnection?.invoke('JoinTableGroup', this.menuQrCodeToken).catch((err) => {
            console.error('JoinTableGroup error:', err);
        });
    }
}