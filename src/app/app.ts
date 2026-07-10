import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './core/services/lang.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  translate = inject(TranslateService);
  private langService = inject(LangService);

  ngOnInit(): void {
    this.langService.apply(localStorage.getItem('lang') || 'en');

  }

}
