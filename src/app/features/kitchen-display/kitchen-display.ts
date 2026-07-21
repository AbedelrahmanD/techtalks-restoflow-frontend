import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';

import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderDto } from '../../core/models/order.model';
import { Spinner } from '../../shared/ui/spinner/spinner';

@Component({
  standalone: true,
  selector: 'app-kitchen-display',
  imports: [ButtonModule, CardModule, MessageModule, TranslatePipe, Spinner],
  templateUrl: './kitchen-display.html',
  styleUrl: './kitchen-display.css',
})
export class KitchenDisplay implements OnInit, OnDestroy {
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);
  errorMessage = signal<string | null>(null);

  orders = this.ordersService.orders;

  pendingOrders = computed(() => this.orders().filter((o) => o.status === 'New'));
  inProgressOrders = computed(() => this.orders().filter((o) => o.status === 'InProgress'));
  servedOrders = computed(() => this.orders().filter((o) => o.status === 'Served'));

  ngOnInit(): void {
    this.ordersService.listOrders().subscribe({
      next: (orders) => {
        this.ordersService.orders.set(orders);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error loading orders');
        this.loading.set(false);
      },
    });

    this.ordersService.connect();
  }

  ngOnDestroy(): void {
    this.ordersService.disconnect();
  }

  startPreparing(order: OrderDto): void {
    this.updateStatus(order, 'InProgress');
  }

  markServed(order: OrderDto): void {
    this.updateStatus(order, 'Served');
  }

  private updateStatus(order: OrderDto, status: string): void {
    this.ordersService.updateStatus(order.id, status).subscribe({
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error updating order');
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
