import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'uploadUrl',
    standalone: true,
})
export class UploadUrlPipe implements PipeTransform {
    transform(path: string | null | undefined): string {
        if (!path) return '';
        const cleaned = path.startsWith('/') ? path.slice(1) : path;
        return `${environment.baseUrl}/${cleaned}`;
    }
}
