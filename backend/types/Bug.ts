
export type BugType = 'feature' | 'bug';
export type BugStatus = 'new' | 'started' | 'completed' | 'resolved';


export interface BugInterface {
    id: number;
    description: string;
    title: string
    screenshot?: string | null;
    type: BugType;
    status: BugStatus,
    bug_creator: number,
    project_id: number,
    deadline: Date
    bug_assignee: number
}

export interface BugRequest {
    description: string;
    title: string
    screenshot?: string | null;
    type: BugType;
    deadline: Date
    status?: BugStatus,
    bug_assignee: number
}

