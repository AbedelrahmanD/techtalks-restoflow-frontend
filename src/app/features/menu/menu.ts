import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';
import { MenuItemImagePipe } from '../../shared/pipes/menu-item-image.pipe';
import { MenuCategoryDto, MenuResponseDto, RestaurantSettingsDto, MenuItemDto } from '../../core/models/menu.model';
import { MenuService } from '../../core/services/menu.service';
import { environment } from '../../../environments/environment';

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
export class Menu implements OnInit {
  private menuService = inject(MenuService);
  private translate = inject(TranslateService);

  loading = signal(true);
  errorMessage = signal<string | null>(null);
  settings = signal<RestaurantSettingsDto | null>(null);
  menu = signal<MenuCategoryDto[]>([]);

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

  ngOnInit(): void {
    this.loadMenu();
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
      currentCart[item.id] = { item, quantity: 1 };
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

  formatPrice(price: number, currencySymbol: string): string {
    return `${currencySymbol}${price.toFixed(2)}`;
  }

  scrollToCategory(categoryId: number): void {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const targetY = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }
}