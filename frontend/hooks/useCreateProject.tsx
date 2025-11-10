'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchData, createProject, assignUsers } from '@/util/api'
import { projectSchema } from '@/lib/validation'
import { ZodError } from 'zod'

interface User {
  id: number
  name: string
  type: 'qa' | 'developer'
}


interface FormData {
  name: string
  description: string
  logo: File | null
  assignedUsers: number[]
}

export function useCreateProject( onSuccess?: () => void ) {
  const { token } = useAuth()
  const [formData, setFormData] = useState<FormData>( {
    name: '',
    description: '',
    logo: null,
    assignedUsers: [],
  } )
  const [errors, setErrors] = useState<Record<string, string>>( {} )
  const [loading, setLoading] = useState( false )
  const [submitError, setSubmitError] = useState<string>( '' )
  const [allUsers, setAllUsers] = useState<User[]>( [] )
  const [usersLoading, setUsersLoading] = useState( false )
  const [logoPreview, setLogoPreview] = useState<string>( '' )

  useEffect( () => {
    if ( !token ) return

    const loadUsers = async () => {
      setUsersLoading( true )
      try {
        const qa = await fetchData( 'users/qas', token )
        const dev = await fetchData( 'users/developers', token )
        const combined = [
          ...( qa.data ).map( ( user: User ) => ( { ...user, type: 'qa' } ) ),
          ...( dev.data ).map( ( user: User ) => ( { ...user, type: 'developer' } ) )
        ]
        // console.log( 'we have users ', combined )
        setAllUsers( combined )
      } catch ( error ) {
        console.error( 'Error loading users:', error )
        setAllUsers( [] )
      } finally {
        setUsersLoading( false )
      }
    }

    loadUsers()
  }, [token] )

  const handleChange = ( field: string, value: string | number[] ) => {
    setFormData( prev => ( { ...prev, [field]: value } as FormData ) )
    if ( errors[field] ) {
      setErrors( prev => ( { ...prev, [field]: '' } ) )
    }
  }

  const handleLogoChange = ( file: File | null ) => {
    setFormData( prev => ( { ...prev, logo: file } ) )
    if ( errors.logo ) {
      setErrors( prev => ( { ...prev, logo: '' } ) )
    }

    console.log( errors.logo )//testing error check

    if ( file ) {
      const reader = new FileReader()
      reader.onload = ( e ) => setLogoPreview( e.target?.result as string )
      reader.readAsDataURL( file )
    } else {
      setLogoPreview( '' )
    }
  }

  const mapUsers = ( formData: FormData, users: User[] ) => {
    const mappedUsers = formData.assignedUsers.map( id => {
      const userType = users.find( user => user.id === id ).type || null;
      return {
        user_id: id,
        type: userType
      };
    } );
    return mappedUsers;
  };



  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    try {
      projectSchema.parse( {
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
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
    console.log( validate() )

    setLoading( true )
    setSubmitError( '' )

    try {
      const projectFormData = new FormData()
      projectFormData.append( 'name', formData.name )
      projectFormData.append( 'description', formData.description )
      if ( formData.logo ) {
        projectFormData.append( 'logo', formData.logo )
      }

      const res = await createProject( projectFormData, token )
      const response = await res.json()
      const project = response.data


      if ( !res.ok ) {
        setSubmitError( response.message || 'Failed to create project' );
        return;
      }

      const assignedUsers = mapUsers( formData, allUsers )
      console.log( assignedUsers )

      if ( formData.assignedUsers.length > 0 ) {
        const assignRes = await assignUsers( project.id, assignedUsers, token )

        if ( !assignRes.ok ) {
          setSubmitError( 'Failed to assign to project' );
          return;
        }
      }

      setFormData( { name: '', description: '', logo: null, assignedUsers: [] } )
      setLogoPreview( '' )
      setErrors( {} )
      onSuccess?.()
      return true
    } catch ( error ) {
      const msg = error instanceof Error ? error.message : 'Something went wrong'
      console.error( msg, error )
      setSubmitError( msg )
      return false
    } finally {
      setLoading( false )
    }
  }

  return {
    formData, handleChange, handleLogoChange, submit, errors, loading, submitError, logoPreview, allUsers, usersLoading,
  }
}
