'use client';

import { useSignupForm } from '@/hooks/useSignupForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import * as React from 'react';
import { ChevronRight, User, Smartphone, Mail, LockKeyhole, EyeOff, Eye } from 'lucide-react';
import { InputAdornment, IconButton, Divider, Typography, Link, Button, TextField, Box, useTheme } from '@mui/material'


export default function SignupPage() {
  return (
    <Suspense fallback={ <>...</> }>
      <Signup />
    </Suspense>
  )
}

function Signup() {
  const searchParams = useSearchParams()
  const userType = searchParams.get( 'type' )
  const router = useRouter()
  const { formData, handleChange, submitError, errors, loading, handleSubmit, handleLoginRedirect, handleBackToJoinUs, handleClickShowPassword, handleMouseDownPassword, handleMouseUpPassword, showPassword } = useSignupForm()
  const theme = useTheme()

  useEffect( () => {
    if ( userType && formData.user_type === '' ) {
      handleChange( 'user_type', userType )
    } else if ( !userType && !formData.user_type ) {
      router.push( '/joinus' )
    }
  }, [userType, formData.user_type, handleChange, router] )

  if ( !userType && !formData.user_type ) {
    return (
      <Box sx={ { textAlign: 'center', mt: 4 } }>
        <Typography variant="h6" sx={ { mb: 2 } }>
          Please select a user type first
        </Typography>
        <Button variant="contained" onClick={ handleBackToJoinUs }>
          Go to Join Us
        </Button>
      </Box>
    )
  }

  return (
    <main>


      <Box
        component="form"
        sx={ { '& .MuiTextField-root': { display: 'flex', m: 1.5, width: '350px', height: '64px' } } }
        noValidate
        autoComplete="off"
        onSubmit={ handleSubmit }
      >
        <Typography variant="h4" component="h1" sx={ { mb: 1.5, ml: 1 } }>
          Sign Up
        </Typography>
        <Typography variant="subtitle2" sx={ { mb: 5, ml: 1 } }>
          Please fill your information below
        </Typography>

        <TextField
          required
          type="text"
          name="name"
          value={ formData.name }
          onChange={ ( e ) => handleChange( 'name', e.target.value ) }
          id="outlined-name"
          label="Full Name"
          fullWidth
          error={ !!errors.name }
          helperText={ errors.name }
          sx={ {} }
          slotProps={ {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <User size={ 20 } />
                </InputAdornment>
              ),
            },
          } }
        />

        <TextField
          required
          type="email"
          name="email"
          value={ formData.email }
          onChange={ ( e ) => handleChange( 'email', e.target.value ) }
          id="outlined-email"
          label="Email"
          fullWidth
          error={ !!errors.email }
          helperText={ errors.email }
          slotProps={ {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={ 20 } />
                </InputAdornment>
              ),
            },
          } }
        />

        <TextField
          type="tel"
          name="phone"
          value={ formData.phone }
          onChange={ ( e ) => handleChange( 'phone', e.target.value ) }
          id="outlined-phone"
          label="Phone"
          fullWidth
          error={ !!errors.phone }
          helperText={ errors.phone }
          slotProps={ {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Smartphone size={ 20 } />
                </InputAdornment>
              ),
            },
          } }
        />

        <TextField
          required
          id="outlined-password-input"
          label="Password"
          type={ showPassword ? 'text' : 'password' }
          name="password"
          autoComplete="new-password"
          value={ formData.password }
          onChange={ ( e ) => handleChange( 'password', e.target.value ) }
          fullWidth
          error={ !!errors.password }
          helperText={ errors.password }
          slotProps={ {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockKeyhole size={ 20 } />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={ handleClickShowPassword }
                    onMouseDown={ handleMouseDownPassword }
                    onMouseUp={ handleMouseUpPassword }
                    edge="end"
                  >
                    { showPassword ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                  </IconButton>
                </InputAdornment>
              )
            },
          } }
        />

        <TextField
          required
          id="outlined-password-confirm"
          label="Confirm Password"
          type={ showPassword ? 'text' : 'password' }
          name="confirmPassword"
          autoComplete="new-password"
          value={ formData.confirmPassword }
          onChange={ ( e ) => handleChange( 'confirmPassword', e.target.value ) }
          fullWidth
          error={ !!errors.confirmPassword }
          helperText={ errors.confirmPassword }
          slotProps={ {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockKeyhole size={ 20 } />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={ handleClickShowPassword }
                    onMouseDown={ handleMouseDownPassword }
                    onMouseUp={ handleMouseUpPassword }
                    edge="end"
                  >
                    { showPassword ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                  </IconButton>
                </InputAdornment>
              )
            },
          } }
        />

        { submitError && <Typography sx={ { my: 2, ml: 2 } } color={ theme.palette.error.main }>{ submitError }</Typography> }


        <Button
          type="submit"
          size="large"
          variant="contained"
          disabled={ loading }
          endIcon={ <ChevronRight /> }
          sx={ { width: '150px', p: 2, height: '45px', ml: 1.5 } }>
          { loading ? 'Loading...' : 'Signup' }
        </Button>
        <Divider sx={ { mt: 2, ml: 2 } } />
        <Box sx={ { mt: 3, textAlign: 'center' } }>
          <Typography variant="body2">
            Already have an account?{ ' ' }
            <Link variant='subtitle1'
              component="button"
              onClick={ ( e ) => {
                e.preventDefault();
                handleLoginRedirect();
              } }
              sx={ { cursor: 'pointer' } }
            >
              Login to your account
            </Link>
          </Typography>
          <Typography variant="body2" sx={ { mt: 1 } }>
            Want to change user type?{ ' ' }
            <Link variant='subtitle1'
              component="button"
              onClick={ ( e ) => {
                e.preventDefault();
                handleBackToJoinUs();
              } }
            >
              Back to Join Us
            </Link>
          </Typography>
        </Box>

      </Box >
    </main>
  )
}