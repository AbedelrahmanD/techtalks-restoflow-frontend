export interface UserProfile {
    id: number;
    username: string;
    createdAt: string;
    updatedAt: string | null;
    role: Role;
    email: string | null;
    phone: string | null;
}

export interface LoginResponse {
    user: UserProfile;
}

export interface LoginCredentials {
    username: String;
    password: String;
}

export interface Role {
    id: number,
    role: string
}