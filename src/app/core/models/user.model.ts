import { Role } from "./auth.models";


export interface UserCreateDto {
    username: string;
    password: string;
    email?: string | null;
    phone?: string | null;
    role: number;
}

export interface UserUpdateDto {
    username: string;
    password?: string | null;
    email?: string | null;
    phone?: string | null;
    role: number;
}

export interface UserDto {
    id: number;
    username: string;
    email: string | null;
    phone: string | null;
    role: Role;
}
