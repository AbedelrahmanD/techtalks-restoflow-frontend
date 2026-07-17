
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu').then(m => m.Menu),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
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