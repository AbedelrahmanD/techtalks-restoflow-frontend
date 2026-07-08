export interface UserProfile {
    id: number;
    username: string;
    createdAt: string;
    updatedAt: string | null;
    role: number;
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