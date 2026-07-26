import { Component, effect, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItemImagePipe } from '../../shared/pipes/menu-item-image.pipe';
import { MenuCategoryDto, MenuResponseDto, RestaurantSettingsDto, MenuItemDto } from '../../core/models/menu.model';
import { MenuService } from '../../core/services/menu.service';
import { MenuOrdersRealtimeService } from '../../core/services/menu-orders-realtime.service';
import { OrdersService } from '../../core/services/orders.service';

export interface CartItem {
  item: MenuItemDto;
  quantity: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MenuItemImagePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  private menuService = inject(MenuService);
  private menuOrdersRealtimeService = inject(MenuOrdersRealtimeService);
  private ordersService = inject(OrdersService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);

  loading = signal(true);
  placingOrder = signal(false);
  errorMessage = signal<string | null>(null);
  placeOrderErrorMessage = signal<string | null>(null);
  settings = signal<RestaurantSettingsDto | null>(null);
  menu = signal<MenuCategoryDto[]>([]);
  qrcode = signal<string | null>(null);
  currentOrder = this.menuOrdersRealtimeService.currentOrder;

  cart = signal<{ [itemId: number]: CartItem }>({});
  isCartOpen = signal(false);

  cartCount = computed(() => {
    return Object.values(this.cart()).reduce((acc, curr) => acc + curr.quantity, 0);
  });

  cartTotal = computed(() => {
    return Object.values(this.cart()).reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  });

  cartList = computed(() => {
    return Object.values(this.cart());
  });

  private syncCartWithCurrentOrder = effect(() => {
    const order = this.currentOrder();

    if (!order) {
      this.cart.set({});
      this.isCartOpen.set(false);
      return;
    }

    this.setCartFromOrder(order);
  });

  ngOnInit(): void {
    const qrcode = this.route.snapshot.paramMap.get('qrcode');
    this.qrcode.set(qrcode);

    if (qrcode) {
      this.ordersService.getCurrentTableOrder(qrcode).subscribe({
        next: (order) => {
          if (order) {
            this.menuOrdersRealtimeService.setCurrentOrder(order);
          }
        },
      });

      this.menuOrdersRealtimeService.connect(qrcode);
    }

    this.loadMenu();
  }

  ngOnDestroy(): void {
    this.menuOrdersRealtimeService.disconnect();
  }

  loadMenu(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.menuService.getMenu().subscribe({
      next: (response: MenuResponseDto) => {
        this.settings.set(response.settings);
        this.menu.set(response.menu);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translate.instant('menuError'));
        this.loading.set(false);
      }
    });
  }

  addToCart(item: MenuItemDto): void {
    const currentCart = { ...this.cart() };
    if (currentCart[item.id]) {
      currentCart[item.id] = {
        ...currentCart[item.id],
        quantity: currentCart[item.id].quantity + 1
      };
    } else {
      currentCart[item.id] = { item, quantity: 1, };
    }
    this.cart.set(currentCart);
  }

  removeFromCart(itemId: number): void {
    const currentCart = { ...this.cart() };
    if (!currentCart[itemId]) return;

    if (currentCart[itemId].quantity > 1) {
      currentCart[itemId] = {
        ...currentCart[itemId],
        quantity: currentCart[itemId].quantity - 1
      };
    } else {
      delete currentCart[itemId];
    }
    this.cart.set(currentCart);
    if (this.cartCount() === 0) {
      this.isCartOpen.set(false);
    }
  }

  getItemQuantity(itemId: number): number {
    return this.cart()[itemId]?.quantity || 0;
  }

  toggleCart(open: boolean): void {
    if (open && this.cartCount() === 0) return;
    this.isCartOpen.set(open);
  }

  isCartLocked(): boolean {
    return !!this.currentOrder();
  }

  placeOrder(): void {
    const qrcode = this.qrcode();

    if (!qrcode) {
      this.placeOrderErrorMessage.set(this.translate.instant('menuOrderMissingQr'));
      return;
    }

    const items = Object.values(this.cart()).map((cartItem) => ({
      menuItemId: cartItem.item.id,
      quantity: cartItem.quantity,
      note: null,
    }));

    if (items.length === 0) {
      return;
    }

    this.placingOrder.set(true);
    this.placeOrderErrorMessage.set(null);

    this.ordersService.createOrder({ qrCodeToken: qrcode, items }).subscribe({
      next: (createdOrder) => {
        this.menuOrdersRealtimeService.setCurrentOrder(createdOrder);
        this.placeOrderErrorMessage.set(null);
        this.placingOrder.set(false);
      },
      error: () => {
        this.placeOrderErrorMessage.set(this.translate.instant('menuOrderError'));
        this.placingOrder.set(false);
      },
    });
  }

  formatPrice(price: number, currencySymbol: string): string {
    return `${currencySymbol}${price.toFixed(2)}`;
  }

  private setCartFromOrder(order: NonNullable<ReturnType<typeof this.currentOrder>>): void {
    const mappedCart: { [itemId: number]: CartItem } = {};

    for (const orderItem of order.items) {
      mappedCart[orderItem.menuItemId] = {
        item: {
          id: orderItem.menuItemId,
          name: orderItem.menuItemName,
          price: orderItem.unitPrice,
          image: orderItem.image ?? null,
        },
        quantity: orderItem.quantity,
      };
    }

    this.cart.set(mappedCart);
  }

  scrollToCategory(categoryId: number): void {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const targetY = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }
}