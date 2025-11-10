'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchData, createBug } from '@/util/api'
import { bugSchema } from '@/lib/validation'
import { BugType } from '@/types/bug'
import { ZodError } from 'zod'
import { ProjectResponse, AssignedTeam } from '@/types/project'


interface BugData {
    title: string
    description: string
    type: BugType | string
    deadline: string
    screenshot: File | null
    bug_assignee: number | null
}

export function useCreateBug(projectId: string | number, onSuccess?: () => void ) {
    const { token } = useAuth()
    const [formData, setFormData] = useState<BugData>( {
        title: '',
        description: '',
        type: '',
        deadline: '',
        screenshot: null,
        bug_assignee: null
    } )
    const [errors, setErrors] = useState<Record<string, string>>( {} )
    const [loading, setLoading] = useState( false )
    const [submitError, setSubmitError] = useState<string>( '' )
    const [project, setProject] = useState<ProjectResponse>()
    const [developers, setDevelopers] = useState<AssignedTeam[]>( [] )
    const [usersLoading, setUsersLoading] = useState( false )
    const [imagePreview, setImagePreview] = useState<string>( '' )

    useEffect( () => {
        if ( !token) return
        const loadUsers = async () => {
            setUsersLoading( true )
            try {
                const res = await fetchData( `projects/${projectId}`, token )
                const data = res.data
                setProject( data )
                const projectDevs = data.assigned_team.filter(
                    ( user: AssignedTeam ) => user.user_type === 'developer'
                )
                setDevelopers( projectDevs )
                console.log( 'Project details: ', data )

            } catch ( error ) {
                console.error( 'Error loading developers', error )
                setDevelopers( [] )
            } finally {
                setUsersLoading( false )
            }
        }
        loadUsers()
    }, [token, projectId] )

    const handleChange = ( field: string, value: string | number ) => {
        setFormData( prev => ( { ...prev, [field]: value } as BugData ) )
        if ( errors[field] ) {
            setErrors( prev => ( { ...prev, [field]: '' } ) )
        }
    }
    
    const handleImageChange = ( file: File | null ) => {
        setFormData( prev => ( { ...prev, screenshot: file } ) )
        if ( errors.screenshot ) {
            setErrors( prev => ( { ...prev, screenshot: '' } ) )
        }

        if ( file ) {
            const reader = new FileReader()
            reader.onload = ( e ) => setImagePreview( e.target?.result as string )
            reader.readAsDataURL( file )
        } else {
            setImagePreview( '' )
        }
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        try {
            bugSchema.parse( {
                title: formData.title,
                description: formData.description,
                screenshot: formData.screenshot,
                type: formData.type,
                deadline: formData.deadline,
                bug_assignee: formData.bug_assignee

            } )
            setErrors( {} )
            return true
        } catch ( err ) {
            console.log( "WE HAVE ERROR: ", err )
            if ( err instanceof ZodError ) {
                err.issues.forEach( ( error ) => {//zod uses issues
                    newErrors[error.path[0] as string] = error.message
                } )
            }
            setErrors( newErrors )
            return false
        }
    }

    const submit = async (): Promise<boolean> => {
        if ( !validate() ) return false
        setLoading( true )
        setSubmitError( '' )

        try {
            const bugForm = new FormData()
            bugForm.append( 'title', formData.title )
            bugForm.append( 'description', formData.description )
            bugForm.append( 'type', formData.type )
            bugForm.append( 'deadline', formData.deadline )
            if ( formData.bug_assignee ) {
                bugForm.append( 'bug_assignee', formData.bug_assignee.toString() )
            }
            if ( formData.screenshot ) {
                bugForm.append( 'screenshot', formData.screenshot )
            }
            console.log(bugForm)
            const res = await createBug( projectId, bugForm, token )
            const response = await res.json()


            if ( !res.ok ) {
                setSubmitError( response.message || 'Failed to create bug' );
                return;
            }
            setFormData( { title: '', description: '', screenshot: null, type: '', deadline: '', bug_assignee: null } )
            setImagePreview( '' )
            setErrors( {} )
            onSuccess?.()
            return true


        } catch ( error ) {
            const msg = error instanceof Error ? error.message : 'Something went wrong'
            console.error( msg, error )
            setSubmitError( msg )
            return false


        }
        finally {
            setLoading( false )

        }

    }

    return {
        formData,
        handleChange,
        handleImageChange,
        submit,
        errors,
        loading,
        submitError,
        imagePreview,
        developers,
        usersLoading,
        project
    }

}
