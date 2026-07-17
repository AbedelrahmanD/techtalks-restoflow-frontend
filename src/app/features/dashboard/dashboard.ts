import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from "../../shared/ui/language-switcher/language-switcher";
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/auth.models';



@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LanguageSwitcher, TranslatePipe, MenuModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  authService = inject(AuthService);
  auth = signal<UserProfile | null>(this.authService.currentUser());
  router = inject(Router);

  items: MenuItem[] | undefined = [
    {
      label: 'logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  menuItems = [
    { label: 'menuUsers', route: '/dashboard/users', icon: 'pi pi-users' },
    { label: 'menuCategories', route: '/dashboard/categories', icon: 'pi pi-tags' },
    { label: 'menuDiningTables', route: '/dashboard/dining-tables', icon: 'pi pi-table' },
    { label: 'menuItems', route: '/dashboard/menu', icon: 'pi pi-book' },
    { label: 'menuQuestions', route: '/dashboard/feedback-questions', icon: 'pi pi-question-circle' },
    { label: 'menuSettings', route: '/dashboard/settings', icon: 'pi pi-cog' }
  ];

  logout() {

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    })
      ;
  }

}
