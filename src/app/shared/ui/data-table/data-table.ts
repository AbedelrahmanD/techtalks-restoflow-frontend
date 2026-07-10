import { Component, ContentChild, TemplateRef, contentChild, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SortIcon, Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Search } from '@primeicons/angular/search';
import { Plus } from '@primeicons/angular/plus';


@Component({
  standalone: true,
  selector: 'app-data-table',
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TranslatePipe,
    Search,
    Plus,
    ButtonModule,
    TranslatePipe,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css'
})
export class DataTable {
  title = input('');
  table = input.required<Table>();
  new = output<void>();

}