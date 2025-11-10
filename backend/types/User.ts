export type UserType = 'developer' | 'manager' | 'qa'

export interface UserInterface {
    id: number;
    email: string;
    name: string;
    phone?: string;
    password: string;
    access_token: string;
    refresh_token: string;
    user_type: UserType;
}

export interface Login {
    email: string,
    password: string
}

export interface LoginResponse {
    //
}

export interface Signup {
    email: string,
    name: string,
    phone?: string,
    password: string,
    user_type: UserType
}

export interface SignupResponse {
    //
}

export interface RefreshToken {
    refresh_token: string
}