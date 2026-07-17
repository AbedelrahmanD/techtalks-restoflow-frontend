import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'menuItemImage',
    standalone: true,
})
export class MenuItemImagePipe implements PipeTransform {
    transform(path: string | null | undefined): string {
        if (!path) {
            return '/images/placeholder-food.jpg';
        }
        const cleaned = path.startsWith('/') ? path.slice(1) : path;
        return `${environment.baseUrl}/${cleaned}`;
    }
}
