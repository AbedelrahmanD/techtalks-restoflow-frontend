import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SortIcon, TableModule } from 'primeng/table';
import { Pencil } from '@primeicons/angular/pencil';
import { Trash } from '@primeicons/angular/trash';
import { MessageModule } from 'primeng/message';

import { DiningTablesService } from '../../../core/services/dining-tables.service';
import { DiningTableDto } from '../../../core/models/dining-table.model';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { TABLE_DEFAULTS } from '../../../shared/config/table.config';

@Component({
  standalone: true,
  selector: 'app-dining-tables-list',
  imports: [
    DataTable,
    TableModule,
    ButtonModule,
    Pencil,
    Trash,
    TranslatePipe,
    SortIcon,
    MessageModule,
  ],
  templateUrl: './dining-tables-list.html',
  styleUrl: './dining-tables-list.css',
})
export class DiningTablesList implements OnInit {
  private diningTablesService = inject(DiningTablesService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  protected readonly tableConfig = TABLE_DEFAULTS;

  tables = signal<DiningTableDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.diningTablesService.listTables().subscribe({
      next: (tables) => {
        this.tables.set(tables);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error loading dining tables');

        this.loading.set(false);
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/dashboard/dining-tables/new']);
  }

  navigateToEdit(id: number | string): void {
    this.router.navigate(['/dashboard/dining-tables/edit', id]);
  }

  navigateToQr(id: number | string): void {
    this.router.navigate(['/dashboard/dining-tables/qr', id]);
  }

  deleteTable(id: number | string): void {
    const confirmed = confirm(this.translate.instant('deleteDiningTableConfirm'));

    if (!confirmed) {
      return;
    }

    this.diningTablesService.deleteTable(id).subscribe({
      next: () => {
        this.loadTables();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Error deleting dining table');
      },
    });
  }
}
