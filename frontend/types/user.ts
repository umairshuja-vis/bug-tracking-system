
type UserType = 'manager' | 'qa' | 'developer';

export interface SignupResponse{
    id: number;
    email: string;
    name: string;
    phone?: string;
    access_token: string;
    refresh_token: string;
    user_type: UserType;
    createdAt: Date;
    updatedAt: Date;
}

export interface Login {
    email: string,
    password: string
}

