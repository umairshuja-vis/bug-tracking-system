export interface ProjectForm {
    name: string;
    description: string;
    logo?: string | null;
}

export interface Assignment{
    user_id: number,
    type: 'qa' | 'developer';
}

export interface AssignedTeam{
    id: number,
    name: string,
    user_type: 'qa' | 'developer',
}

export interface ProjectResponse {
    id: number,
    name: string,
    description: string,
    logo: string
    createdAt: Date,
    updatedAt: Date,
    assigned_team: AssignedTeam[]
    tasks?: { completed: number, total: number }
}

