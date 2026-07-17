import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { SettingsService } from '../../../core/services/settings.service';
import { CurrencyService } from '../../../core/services/currency.service';
import { SettingsCreateDto } from '../../../core/models/settings.model';
import { CurrencyDto } from '../../../core/models/currency.model';
import { environment } from '../../../../environments/environment';

@Component({
    standalone: true,
    selector: 'app-settings-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        FileUploadModule,
        MessageModule,
        SelectModule,
        TranslatePipe,
        Spinner
    ],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.css'
})
export class SettingsForm implements OnInit {

    private fb = inject(FormBuilder);
    private settingsService = inject(SettingsService);
    private currencyService = inject(CurrencyService);

    form = this.fb.nonNullable.group({
        currencyId: [0],
        restaurantName: ['', Validators.required]
    });

    loading = signal(true);
    saving = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    selectedLogo = signal<File | undefined>(undefined);
    logoUrl = signal<string | null>(null);
    currencies = signal<CurrencyDto[]>([]);
    errorFields = signal<any>({});

    ngOnInit(): void {
        this.loadCurrencies();
        this.loadSettings();
    }

    loadCurrencies(): void {
        this.currencyService.listCurrencies().subscribe({
            next: (items) => this.currencies.set(items),
            error: () => this.currencies.set([])
        });
    }

    loadSettings(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.settingsService.getSettings().subscribe({
            next: (settings) => {
                this.form.patchValue({
                    currencyId: settings.currency?.id ?? 0,
                    restaurantName: settings.restaurantName ?? ''
                });
                this.logoUrl.set(settings.logoUrl ? environment.baseUrl + '/' + settings.logoUrl : null);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    onLogoSelect(event: any): void {
        const file = event?.files?.[0] ?? undefined;
        this.selectedLogo.set(file);
    }

    onSubmit(): void {

        const data: SettingsCreateDto = {
            currencyId: this.form.getRawValue().currencyId ?? 0,
            restaurantName: this.form.getRawValue().restaurantName ?? '',
            logo: this.selectedLogo()
        };
        this.errorFields.set(null);
        this.saving.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        this.settingsService.saveSettings(data).subscribe({
            next: (response) => {
                this.saving.set(false);
                this.successMessage.set(response.message);
            },
            error: (error) => {
                this.saving.set(false);
                this.errorMessage.set(error.error?.message);
                this.errorFields.set(error.error?.errors ?? {});
            }
        });
    }
}
