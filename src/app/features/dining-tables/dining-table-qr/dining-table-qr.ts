import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    inject,
    signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import * as QRCode from 'qrcode';

import { Spinner } from '../../../shared/ui/spinner/spinner';
import { DiningTablesService } from '../../../core/services/dining-tables.service';
import { DiningTableDto } from '../../../core/models/dining-table.model';

@Component({
    standalone: true,
    selector: 'app-dining-table-qr',
    imports: [
        ButtonModule,
        CardModule,
        MessageModule,
        TranslatePipe,
        Spinner
    ],
    templateUrl: './dining-table-qr.html',
    styleUrl: './dining-table-qr.css'
})
export class DiningTableQr implements OnInit {
    private diningTablesService = inject(DiningTablesService);
    private route = inject(ActivatedRoute);

    router = inject(Router);

    @ViewChild('qrCanvas') qrCanvas?: ElementRef<HTMLCanvasElement>;

    table = signal<DiningTableDto | null>(null);
    qrValue = signal<string>('');
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.errorMessage.set('Invalid table');
            this.loading.set(false);
            return;
        }

        this.diningTablesService.getTable(id).subscribe({
            next: table => {
                this.table.set(table);

                // Uses the domain the app is currently running on
                // (localhost while developing, the real domain once deployed)
                // instead of a hardcoded value.
                const domain = window.location.origin;
                this.qrValue.set(`${domain}/menu/${table.qrCodeToken}`);

                this.loading.set(false);

                // Wait a tick so the canvas element exists in the DOM
                // before we try to draw on it.
                setTimeout(() => this.renderQrCode(), 0);
            },
            error: error => {
                this.errorMessage.set(error.error?.message ?? '');
                this.loading.set(false);
            }
        });
    }

    private renderQrCode(): void {
        if (!this.qrCanvas) {
            return;
        }

        QRCode.toCanvas(
            this.qrCanvas.nativeElement,
            this.qrValue(),
            { width: 240, margin: 2 },
            error => {
                if (error) {
                    this.errorMessage.set('Failed to generate QR code');
                }
            }
        );
    }

    downloadQrCode(): void {
        if (!this.qrCanvas) {
            return;
        }

        const link = document.createElement('a');
        link.download = `table-${this.table()?.tableNumber}-qr.png`;
        link.href = this.qrCanvas.nativeElement.toDataURL('image/png');
        link.click();
    }

    printQrCode(): void {
        window.print();
    }
}
