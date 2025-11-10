import { getProjectBugs } from './api'


export const getTasks = async ( projectId: number, token: string ) => {

    const bugs = await getProjectBugs( `${projectId}`, token )
    const total: number = bugs.length;
    const completed:number = ( bugs.filter( bug => bug.status == 'completed' || bug.status == 'resolved' ) ).length;

    return { completed, total }

}