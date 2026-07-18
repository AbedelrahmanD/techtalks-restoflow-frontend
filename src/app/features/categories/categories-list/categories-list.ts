import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SortIcon, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Pencil } from '@primeicons/angular/pencil';
import { Trash } from '@primeicons/angular/trash';
import { MessageModule } from 'primeng/message';

import { CategoriesService } from '../../../core/services/categories.service';
import { CategoryDto } from '../../../core/models/category.model';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { TABLE_DEFAULTS } from '../../../shared/config/table.config';
import { MenuItemImagePipe } from '../../../shared/pipes/menu-item-image.pipe';

@Component({
    standalone: true,
    selector: 'app-categories-list',
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
    templateUrl: './categories-list.html',
    styleUrl: './categories-list.css'
})
export class CategoriesList implements OnInit {
    private categoriesService = inject(CategoriesService);
    private router = inject(Router);
    private translate = inject(TranslateService);

    protected readonly tableConfig = TABLE_DEFAULTS;

    categories = signal<CategoryDto[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.categoriesService.listCategories().subscribe({
            next: categories => {
                this.categories.set(categories);
                this.loading.set(false);
            },
            error: error => {
                this.errorMessage.set(error.error?.message ?? 'Error loading categories');
                this.loading.set(false);
            }
        });
    }

    navigateToNew(): void {
        this.router.navigate(['/dashboard/categories/new']);
    }

    navigateToEdit(id: number | string): void {
        this.router.navigate(['/dashboard/categories/edit', id]);
    }

    deleteCategory(id: number | string): void {
        const confirmed = confirm(this.translate.instant('deleteCategoryConfirm'));

        if (!confirmed) {
            return;
        }

        this.categoriesService.deleteCategory(id).subscribe({
            next: () => {
                this.loadCategories();
            },
            error: error => {
                this.errorMessage.set(error.error?.message ?? 'Error deleting category');
            }
        });
    }
}
