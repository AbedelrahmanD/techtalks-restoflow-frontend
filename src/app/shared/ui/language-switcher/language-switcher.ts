import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../core/services/lang.service';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  imports: [ButtonModule],
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);
  private langService = inject(LangService);

  currentLang: string = 'en';
  selectedLanguage: string = 'en';

  ngOnInit(): void {
    this.currentLang = this.translate.getCurrentLang() || 'en';
  }

  toggleLanguage(): void {
    const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', nextLang);
    this.currentLang = nextLang;
    this.applyLanguage(nextLang);
  }

  applyLanguage(langCode: string): void {
    this.langService.apply(langCode);
  }
}
