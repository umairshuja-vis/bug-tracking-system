export type BugStatus = 'new' | 'started' | 'completed' | 'resolved';
export type BugType = 'bug' | 'feature';

export interface Bug {
    id: number;
    title: string;
    description: string;
    screenshot: string;
    type: BugType;
    status: BugStatus;
    bug_creator: number;
    project_id: number;
    deadline: string;
    bug_assignee: number;
    createdAt: string;
    updatedAt: string;
    assignee: BugAssignee
}

export interface BugResponse {
    success: boolean;
    data: Bug[];
}

export interface BugAssignee {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string
}
