import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCreateDto, UserDto, UserUpdateDto } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    users = signal<UserDto[]>([]);

    listUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>('/api/User');
    }

    getUser(id: number | string): Observable<UserDto> {
        return this.http.get<UserDto>(`/api/User/${id}`);
    }

    createUser(payload: UserCreateDto): Observable<UserDto> {
        return this.http.post<UserDto>('/api/User', payload);
    }

    updateUser(id: number | string, payload: UserUpdateDto): Observable<UserDto> {
        if (payload.password == '') {
            payload.password = null;
        }
        return this.http.put<UserDto>(`/api/User/${id}`, payload);
    }

    deleteUser(id: number | string): Observable<void> {
        return this.http.delete<void>(`/api/User/${id}`);
    }
}
