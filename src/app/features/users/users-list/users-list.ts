import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Pencil } from '@primeicons/angular/pencil';
import { Trash } from '@primeicons/angular/trash';
import { UsersService } from '../../../core/services/users.service';
import { UserDto } from '../../../core/models/user.model';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { SortIcon, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TABLE_DEFAULTS } from '../../../shared/config/table.config';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [
    DataTable,
    InputIconModule,
    IconFieldModule,
    TableModule,
    ButtonModule,
    Pencil,
    Trash,
    TranslatePipe,
    SortIcon,
    DataTable,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected readonly tableConfig = TABLE_DEFAULTS;

  users = signal<UserDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  test() {
    alert();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.usersService.listUsers().subscribe({
      next: (items) => {
        this.users.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Error');
        this.loading.set(false);
      }
    });
  }

  navigateToEdit(id: number | string): void {
    this.router.navigate(['/dashboard/users/edit', id]);
  }

  navigateToNew(): void {
    this.router.navigate(['/dashboard/users/new']);
  }

  deleteUser(id: number | string): void {
    if (!confirm(this.translate.instant('deleteConfirm'))) {
      return;
    }

    this.usersService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Error');
      }
    });
  }
}