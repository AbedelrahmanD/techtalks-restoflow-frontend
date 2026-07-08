import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, LoginResponse, UserProfile } from '../models/auth.models';
import { TranslateService } from '@ngx-translate/core';

interface LanguageOption {
    label: string;
    value: string;
    dir: 'ltr' | 'rtl';
}

@Injectable({
    providedIn: 'root'
})
export class LangService {
    private translate = inject(TranslateService);
    languages: LanguageOption[] = [
        { label: 'English', value: 'en', dir: 'ltr' },
        { label: 'العربية', value: 'ar', dir: 'rtl' }
    ];

    apply(langCode: string): void {
        this.translate.use(langCode);

        const matchedLang = this.languages.find(l => l.value === langCode);
        if (matchedLang) {
            document.documentElement.lang = matchedLang.value;
            document.documentElement.dir = matchedLang.dir;
        }
    }
}