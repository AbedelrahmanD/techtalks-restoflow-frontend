import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SortIcon, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Pencil } from '@primeicons/angular/pencil';
import { Trash } from '@primeicons/angular/trash';
import { MessageModule } from 'primeng/message';

import { MenuItemsService } from '../../../core/services/menu-items.service';
import { MenuItemDto } from '../../../core/models/menu-item.model';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { TABLE_DEFAULTS } from '../../../shared/config/table.config';
import { MenuItemImagePipe } from '../../../shared/pipes/menu-item-image.pipe';

@Component({
  standalone: true,
  selector: 'app-menu-items-list',
  imports: [
    DataTable,
    TableModule,
    ButtonModule,
    TagModule,
    Pencil,
    Trash,
    TranslatePipe,
    SortIcon,
    MessageModule,
    MenuItemImagePipe,
  ],
  templateUrl: './menu-items-list.html',
  styleUrl: './menu-items-list.css',
})
export class MenuItemsList implements OnInit {
  private menuItemsService = inject(MenuItemsService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  protected readonly tableConfig = TABLE_DEFAULTS;

  menuItems = signal<MenuItemDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.menuItemsService.listMenuItems().subscribe({
      next: (menuItems) => {
        this.menuItems.set(menuItems);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error loading menu items');
        this.loading.set(false);
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/dashboard/menu/new']);
  }

  navigateToEdit(id: number | string): void {
    this.router.navigate(['/dashboard/menu/edit', id]);
  }

  deleteMenuItem(id: number | string): void {
    const confirmed = confirm(this.translate.instant('deleteMenuItemConfirm'));

    if (!confirmed) {
      return;
    }

    this.menuItemsService.deleteMenuItem(id).subscribe({
      next: () => {
        this.loadMenuItems();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error deleting menu item');
      },
    });
  }
}
