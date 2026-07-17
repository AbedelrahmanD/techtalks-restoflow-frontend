import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Spinner } from '../../../shared/ui/spinner/spinner';
import { DiningTablesService } from '../../../core/services/dining-tables.service';
import {
  DiningTableCreateDto,
  DiningTableDto,
  DiningTableUpdateDto,
} from '../../../core/models/dining-table.model';

@Component({
  standalone: true,
  selector: 'app-dining-table-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    MessageModule,
    TranslatePipe,
    Spinner,
  ],
  templateUrl: './dining-table-form.html',
  styleUrl: './dining-table-form.css',
})
export class DiningTableForm implements OnInit {
  private fb = inject(FormBuilder);
  private diningTablesService = inject(DiningTablesService);

  router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    tableNumber: ['', [Validators.required, Validators.maxLength(50)]],
    seatingCapacity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  id = signal(0);
  isEdit = signal(false);
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  errorFields = signal<any>({});

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.id.set(Number(id));
    this.isEdit.set(true);

    this.diningTablesService.getTable(id).subscribe({
      next: (table) => {
        this.form.patchValue({
          tableNumber: table.tableNumber,
          seatingCapacity: table.seatingCapacity,
        });

        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? '');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.errorFields.set({});

    const rawData = this.form.getRawValue();

    const data = {
      tableNumber: rawData.tableNumber.trim(),
      seatingCapacity: rawData.seatingCapacity,
    };

    const callApi: Observable<DiningTableDto | void> = this.isEdit()
      ? this.diningTablesService.updateTable(this.id(), data as DiningTableUpdateDto)
      : this.diningTablesService.createTable(data as DiningTableCreateDto);

    callApi.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/dining-tables']);
      },
      error: (error) => {
        this.errorFields.set(error.error?.errors ?? {});
        this.errorMessage.set(error.error?.message ?? '');
        this.saving.set(false);
      },
    });
  }
}
