import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Spinner } from '../../../shared/ui/spinner/spinner';
import { CategoriesService } from '../../../core/services/categories.service';
import {
    CategoryCreateDto,
    CategoryDto,
    CategoryUpdateDto
} from '../../../core/models/category.model';
import { environment } from '../../../../environments/environment';

@Component({
    standalone: true,
    selector: 'app-category-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        ToggleSwitchModule,
        FileUploadModule,
        CardModule,
        MessageModule,
        TranslatePipe,
        Spinner
    ],
    templateUrl: './category-form.html',
    styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit {
    private fb = inject(FormBuilder);
    private categoriesService = inject(CategoriesService);

    router = inject(Router);
    private route = inject(ActivatedRoute);

    form = this.fb.nonNullable.group({
        name: [
            '',
            [Validators.required, Validators.maxLength(255)]
        ],
        isActive: [true]
    });

    id = signal(0);
    isEdit = signal(false);
    loading = signal(true);
    saving = signal(false);
    errorMessage = signal<string | null>(null);
    errorFields = signal<any>({});
    selectedImage = signal<File | undefined>(undefined);
    imageUrl = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.loading.set(false);
            return;
        }

        this.id.set(Number(id));
        this.isEdit.set(true);

        this.categoriesService.getCategory(id).subscribe({
            next: category => {
                this.form.patchValue({
                    name: category.name,
                    isActive: category.isActive
                });
                this.imageUrl.set(
                    category.imageUrl ? environment.baseUrl + '/' + category.imageUrl : null
                );

                this.loading.set(false);
            },
            error: error => {
                this.errorMessage.set(error.error?.message ?? '');
                this.loading.set(false);
            }
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
            name: rawData.name.trim(),
            isActive: rawData.isActive,
            image: this.selectedImage()
        };

        const callApi: Observable<CategoryDto | void> = this.isEdit()
            ? this.categoriesService.updateCategory(this.id(), data as CategoryUpdateDto)
            : this.categoriesService.createCategory(data as CategoryCreateDto);

        callApi.subscribe({
            next: () => {
                this.router.navigate(['/dashboard/categories']);
            },
            error: error => {
                this.errorFields.set(error.error?.errors ?? {});
                this.errorMessage.set(error.error?.message ?? '');
                this.saving.set(false);
            }
        });
    }
}
