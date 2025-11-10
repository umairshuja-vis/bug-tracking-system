'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchData } from '@/util/api'
import { ProjectResponse } from '@/types/project'
import { useRouter } from 'next/navigation'
import { getTasks } from '@/util/getTasks';


export function useProjects() {
    const [projects, setProjects] = useState<ProjectResponse[] | null>();
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();

    const fetchProjects = useCallback( async () => {
        if ( authLoading || !token || !user ) {
            setLoading( false );
            router.push( '/login' )
            return;
        }

        try {
            const res = await fetchData( 'projects', token );
            const data = res.data

            const projectBugs: ProjectResponse[] = await Promise.all(
                data.map( async ( project ) => {
                    const tasks = await getTasks( project.id, token );
                    return { ...project, tasks };
                } )
            );


            console.log( "PROJECT BUGS", projectBugs );

            setProjects( projectBugs );
            // console.log( "Total PROJECTS:", data.data.length )
            setError( null );
        } catch ( err ) {
            setError( err.message );
        } finally {
            setLoading( false );
        }
    }, [authLoading, token, user, router] );


    useEffect( () => {
        if ( authLoading ) {
            return;
        }

        if ( !token || !user ) {
            setLoading( false );
            return;
        }

        fetchProjects();
    }, [token, user, authLoading, fetchProjects] );

    return {
        error,
        loading,
        projects,
        user,
        refetch: fetchProjects,
    }
}