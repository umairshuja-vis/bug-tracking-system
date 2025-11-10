'use client'

import { useTheme } from '@mui/material'
import { BugStatus } from '@/types/bug'

export const useStatusStyle = () => {
    const theme = useTheme()

    const getStatusStyle = ( status: string ) => {
        const styles: Record<string, { bg: string; text: string }> = {
            new: { bg: theme.palette.error.light, text: theme.palette.error.main },
            started: { bg: theme.palette.info.light, text: theme.palette.info.main },
            completed: { bg: theme.palette.success.light, text: theme.palette.success.main },
            resolved: { bg: theme.palette.success.light, text: theme.palette.success.main }
        }
        return styles[status] || styles.new
    }

    const getStatusOptions = ( bugType: string ): BugStatus[] => {
        if ( bugType === 'bug' ) {
            return ['new', 'started', 'resolved']
        }
        return ['new', 'started', 'completed']
    }

    return { getStatusStyle, getStatusOptions }
}


