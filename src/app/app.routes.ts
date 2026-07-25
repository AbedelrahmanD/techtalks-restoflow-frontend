import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { kitchenGuard } from './core/guards/kitchen.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'menu/:qrcode',
    loadComponent: () => import('./features/menu/menu').then((m) => m.Menu),
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./features/customer-feedback/customer-feedback').then((m) => m.CustomerFeedback),
  },
  {
    path: 'kitchen-display',
    loadComponent: () =>
      import('./features/kitchen-display/kitchen-display').then((m) => m.KitchenDisplay),
    canActivate: [kitchenGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/users/users-list/users-list').then((m) => m.UsersList),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/users/user-form/user-form').then((m) => m.UserForm),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/users/user-form/user-form').then((m) => m.UserForm),
          },
        ],
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/categories/categories-list/categories-list').then(
                (m) => m.CategoriesList,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/categories/category-form/category-form').then(
                (m) => m.CategoryForm,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/categories/category-form/category-form').then(
                (m) => m.CategoryForm,
              ),
          },
        ],
      },
      {
        path: 'dining-tables',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/dining-tables/dining-tables-list/dining-tables-list').then(
                (m) => m.DiningTablesList,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/dining-tables/dining-table-form/dining-table-form').then(
                (m) => m.DiningTableForm,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/dining-tables/dining-table-form/dining-table-form').then(
                (m) => m.DiningTableForm,
              ),
          },
          {
            path: 'qr/:id',
            loadComponent: () =>
              import('./features/dining-tables/dining-table-qr/dining-table-qr').then(
                (m) => m.DiningTableQr,
              ),
          },
        ],
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/menu-items/menu-items-list/menu-items-list').then(
                (m) => m.MenuItemsList,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/menu-items/menu-item-form/menu-item-form').then(
                (m) => m.MenuItemForm,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/menu-items/menu-item-form/menu-item-form').then(
                (m) => m.MenuItemForm,
              ),
          },
        ],
      },
      {
        path: 'feedback-questions',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/feedback-questions/feedback-questions-list/feedback-questions-list').then(
                (m) => m.FeedbackQuestionsList,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/feedback-questions/feedback-question-form/feedback-question-form').then(
                (m) => m.FeedbackQuestionForm,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/feedback-questions/feedback-question-form/feedback-question-form').then(
                (m) => m.FeedbackQuestionForm,
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings-form/settings-form').then((m) => m.SettingsForm),
      },
    ],
  },
];
