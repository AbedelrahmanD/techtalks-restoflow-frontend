import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Spinner } from '../../../shared/ui/spinner/spinner';
import { MenuItemsService } from '../../../core/services/menu-items.service';
import { CategoriesService } from '../../../core/services/categories.service';
import {
  MenuItemCreateDto,
  MenuItemDto,
  MenuItemUpdateDto,
} from '../../../core/models/menu-item.model';
import { CategoryDto } from '../../../core/models/category.model';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-menu-item-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ToggleSwitchModule,
    FileUploadModule,
    SelectModule,
    CardModule,
    MessageModule,
    TranslatePipe,
    Spinner,
  ],
  templateUrl: './menu-item-form.html',
  styleUrl: './menu-item-form.css',
})
export class MenuItemForm implements OnInit {
  private fb = inject(FormBuilder);
  private menuItemsService = inject(MenuItemsService);
  private categoriesService = inject(CategoriesService);

  router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    categoryId: [0, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    isActive: [true],
  });

  id = signal(0);
  isEdit = signal(false);
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  errorFields = signal<any>({});
  selectedImage = signal<File | undefined>(undefined);
  imageUrl = signal<string | null>(null);
  categories = signal<CategoryDto[]>([]);

  ngOnInit(): void {
    this.categoriesService.listCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.id.set(Number(id));
    this.isEdit.set(true);

    this.menuItemsService.getMenuItem(id).subscribe({
      next: (item) => {
        this.form.patchValue({
          categoryId: item.categoryId,
          name: item.name,
          description: item.description ?? '',
          price: item.price,
          isActive: item.isActive,
        });
        this.imageUrl.set(item.imageUrl ? environment.baseUrl + '/' + item.imageUrl : null);

        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? '');
        this.loading.set(false);
      },
    });
  }

  onImageSelect(event: any): void {
    const file = event?.files?.[0] ?? undefined;
    this.selectedImage.set(file);
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
      categoryId: rawData.categoryId,
      name: rawData.name.trim(),
      description: rawData.description?.trim() || undefined,
      price: rawData.price,
      isActive: rawData.isActive,
      image: this.selectedImage(),
    };

    const callApi: Observable<MenuItemDto | void> = this.isEdit()
      ? this.menuItemsService.updateMenuItem(this.id(), data as MenuItemUpdateDto)
      : this.menuItemsService.createMenuItem(data as MenuItemCreateDto);

    callApi.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/menu']);
      },
      error: (error) => {
        this.errorFields.set(error.error?.errors ?? {});
        this.errorMessage.set(error.error?.message ?? '');
        this.saving.set(false);
      },
    });
  }
}
