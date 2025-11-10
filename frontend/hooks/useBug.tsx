'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProjectBug } from '@/util/api'
import { Bug } from '@/types/bug'
import { useRouter } from 'next/navigation';



export function useBug( bugId: string | number ) {
    const [bug, setBug] = useState<Bug | null>( null );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState<string | null>( null );
    const { user, token, loading: authLoading } = useAuth();

    const router = useRouter();


    const fetchBug = useCallback( async () => {
        if ( authLoading || !token || !user ) {
            setLoading( false );
            router.push('/login')
            return;
        }

        try {
            const data = await getProjectBug( String(bugId), token )
            setBug( data );
            setError( null );
        } catch ( err ) {
            setError( err instanceof Error ? err.message : 'Failed to fetch' );
        } finally {
            setLoading( false );
        }
    }, [authLoading, token, user, bugId, router] );

    useEffect( () => {
        if ( authLoading ) {
            return;
        }

        if ( !token || !user ) {
            setLoading( false );
            return;
        }

        fetchBug();
    }, [token, user, authLoading, fetchBug] );

    return {
        error,
        loading,
        bug,
        user,
        refetch: fetchBug,
    }
}
