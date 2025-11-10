'use client';

import { useState } from 'react';
import { signupSchema } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import { userAuth } from '@/util/api'


type UserType = 'manager' | 'qa' | 'developer';

export function useSignupForm() {
  const [formData, setFormData] = useState( {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    user_type: '' as UserType | '',
  } );
  const [errors, setErrors] = useState<Record<string, string>>( {} );
  const [loading, setLoading] = useState( false );
  const [submitError, setSubmitError] = useState<string | null>( null );
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState( false );

  const handleClickShowPassword = () => setShowPassword( ( show ) => !show );

  const handleMouseUpPassword = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    event.preventDefault();
  };

  const handleMouseDownPassword = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    event.preventDefault();
  };

  const handleChange = ( field: string, value: string ) => {
    setFormData( previous => ( { ...previous, [field]: value } ) );
    if ( errors[field] ) {
      setErrors( prev => ( { ...prev, [field]: '' } ) );
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    try {
      signupSchema.parse( formData );
      setErrors( {} );
      return true;
    } catch ( err ) {
      if ( err instanceof ZodError ) {
        err.issues.forEach( ( error ) => {
          newErrors[error.path[0] as string] = error.message;
        } );
      }
      setErrors( newErrors );
      return false;
    }
  };

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
    setSubmitError( null );

    if ( !validate() ) return;

    setLoading( true );

    try {
      const res = await userAuth( 'sign-up', formData )
      const response = await res.json();
      const data = response.data

      if ( !res.ok ) {
        setSubmitError( response.message || 'Failed' );
        return;
      }
      login( data.id, formData.email, data.name, formData.user_type as UserType, data.access_token );
      setTimeout( () => {
        router.push( '/projects' );
      }, 2000 );
    } catch ( e ) {
      setSubmitError( `Error while signup. Please try again: ${e}` );
    } finally {
      setLoading( false );
    }
  };

  const handleLoginRedirect = () => {
    router.push( '/login' );
  };

  const handleBackToJoinUs = () => {
    router.push( '/joinus' );
  };

  return {
    formData,
    handleChange,
    errors,
    loading,
    submitError,
    handleSubmit,
    handleLoginRedirect,
    handleBackToJoinUs,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    showPassword
  };
}
