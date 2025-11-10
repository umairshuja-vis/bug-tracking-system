'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProjectBugs } from '@/util/api'
import { Bug } from '@/types/bug'
import { useRouter } from 'next/navigation';

export function useBugs( projectId: string | number ) {
    const [bugs, setBugs] = useState<Bug[] | null>( null );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState<string | null>( null );
    const { user, token, loading: authLoading } = useAuth();

    const router = useRouter();

    const fetchBugs = useCallback( async () => {
        if ( authLoading || !token || !user ) {
            setLoading( false );
            router.push('/login')
            return;
        }

        try {
            const data = await getProjectBugs( String(projectId), token )
            setBugs( data );
            setError( null );
        } catch ( err ) {
            setError( err instanceof Error ? err.message : 'Failed to fetch' );
        } finally {
            setLoading( false );
        }
    }, [authLoading, token, user, projectId, router] );

    useEffect( () => {
        if ( authLoading ) {
            return;
        }

        if ( !token || !user ) {
            setLoading( false );
            return;
        }

        fetchBugs();
    }, [token, user, authLoading, fetchBugs] );

    return {
        error,
        loading,
        bugs,
        user,
        refetch: fetchBugs,
    }
}
