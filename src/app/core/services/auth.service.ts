import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, LoginResponse, UserProfile } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<UserProfile | null>(null);

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/Auth/login', credentials).pipe(
      tap(response => this.currentUser.set(response.user))
    );
  }

  refreshUser(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>('/api/Auth/refresh').pipe(
      tap({
        next: (response) => this.currentUser.set(response.user),
        error: () => this.currentUser.set(null)
      })
    );
  }
}