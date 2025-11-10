export interface ProjectInterface {
    id: number;
    name: string;
    description: string;
    logo?: string | null;
    manager_id: number;
}

export interface ProjectRequest {
    name: string;
    description: string;
    logo?: string;
}

export interface ProjectResponse {
    //
}

export interface ProjectAssignmentInterface {
    project_id: number;
    user_id: number;
    type: 'developer' | 'qa';
}

export interface AssignProject {
    user_id: number;
    type: 'developer' | 'qa';
}

export interface AssignProjectRequest extends Array<AssignProject> {}