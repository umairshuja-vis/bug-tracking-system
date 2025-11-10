import { BugStatus } from '@/types/bug'

const BASE_URL = 'http://localhost:3001/api/v1';

export const fetchData = async ( endpoint: string, token: string ) => {
    const res = await fetch( `${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    } );

    if ( !res.ok ) {
        const error = await res.text();
        throw new Error( error || 'Failed to fetch' );
    }

    return res.json()
}
export const getProjectBugs = async ( projectId: string, token: string ) => {
    const res = await fetchData( `projects/${projectId}/bugs`, token )

    return res.data

}

export const getProjectBug = async ( bugId: string, token: string ) => {
    const res = await fetchData( `bugs/${bugId}`, token )

    return res.data

}

export const userAuth = async ( endpoint: string, formData ) => {

    const res = await fetch( `${BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( formData ),
    } );


    return res
}

export const deleteBug = async ( bugId, token: string ) => {

    const res = await fetch( `${BASE_URL}/bugs/${bugId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    } );


    return res
}


export const updateBugStatus = async ( bugId, newStatus: BugStatus, token: string ) => {

    const res = await fetch( `${BASE_URL}/bugs/${bugId}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { status: newStatus } )
    } );

    return res
}

export const createBug = async ( projectId: string | number, bugForm: FormData, token: string ) => {
    const res = await fetch( `${BASE_URL}/projects/${projectId}/bugs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: bugForm,
    } );

    return res
}

export const createProject = async ( projectForm: FormData, token: string ) => {
    const res = await fetch( `${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: projectForm,
    } );

    return res
}

export const assignUsers = async ( projectId, assignedUsers, token: string ) => {
    const res = await fetch( `${BASE_URL}/projects/${projectId}/assign`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify( assignedUsers ),
    } );

    return res
}