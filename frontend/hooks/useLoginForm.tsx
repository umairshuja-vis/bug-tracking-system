'use client';

import { useState } from 'react';
import { loginSchema } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import { userAuth } from '@/util/api'

export function useLoginForm() {
  const [formData, setFormData] = useState( {
    email: '',
    password: '',
  } );
  const [errors, setErrors] = useState<Record<string, string>>( {} );
  const [loading, setLoading] = useState( false );
  const [submitError, setSubmitError] = useState<string | null>( null );
  const [showPassword, setShowPassword] = useState( false );

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = ( field: string, value: string ) => {
    setFormData( previous => ( { ...previous, [field]: value } ) );
    if ( errors[field] ) {
      setErrors( prev => ( { ...prev, [field]: '' } ) );
    }
  };

  const handleClickShowPassword = () => setShowPassword( ( show ) => !show );



  const validate = () => {
    const newErrors: Record<string, string> = {};
    try {
      loginSchema.parse( formData );
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


  const handleMouseUpPassword = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    event.preventDefault();
  };
  
  const handleMouseDownPassword = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    event.preventDefault();
  };


  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
    setSubmitError( null );
    if ( !validate() ) return;
    setLoading( true );
    try {
      const res = await userAuth( 'login', formData )
      const response = await res.json();
      const data = response.data

      if ( !res.ok ) {
        setSubmitError( response.message || 'Login failed, try again' );
        return;
      }
      login( data.id, formData.email, data.name, data.user_type, data.access_token );
      router.push( '/projects' );
    } catch ( e ) {
      setSubmitError( `Error logging in. Try again: ${e}` );
    } finally {
      setLoading( false );
    }
  };

  const handleSignupRedirect = () => {
    router.push( '/joinus' );
  };

  return {
    formData,
    handleChange,
    errors,
    loading,
    submitError,
    handleSubmit,
    handleSignupRedirect,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    showPassword
  };
}
