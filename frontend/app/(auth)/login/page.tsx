'use client'
import { useLoginForm } from '@/hooks/useLoginForm'
import * as React from 'react';
import { ChevronRight, Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { InputAdornment, Divider, IconButton, Typography, Link, Button, TextField, Box, useTheme } from '@mui/material'

const Login = () => {
  const { formData, handleChange, errors, submitError, loading, handleSubmit, handleSignupRedirect, handleClickShowPassword, handleMouseDownPassword, handleMouseUpPassword, showPassword } = useLoginForm()
  const theme = useTheme()

  return (
    <Box sx={ { width: '100%', maxWidth: '350px', m: 2 } }>
      <Typography
        variant="h1"
        sx={ {
          fontSize: '32px',
          fontWeight: 600,
          color: 'text.primary'
        } }
      >
        Login
      </Typography>

      <Typography
        variant="body2"
        sx={ {
          mb: 4,
          color: 'text.secondary'
        } }
      >
        Please enter your login details
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={ handleSubmit }
      >
        <TextField
          required
          type="email"
          name="email"
          value={ formData.email }
          onChange={ ( e ) => handleChange( 'email', e.target.value ) }
          label="Email"
          fullWidth
          error={ !!errors.email }
          helperText={ errors.email }
          sx={ { mb: 2.5 } }
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
          label="Password"
          type={ showPassword ? 'text' : 'password' }
          name="password"
          autoComplete="current-password"
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
                    { showPassword ? <EyeOff size={20}/> : <Eye size={20} /> }
                  </IconButton>
                </InputAdornment>
              )
            },
          } }

        />

        { submitError && <Typography sx={ { mt: 2 } } color={ theme.palette.error.main }>{ submitError }</Typography> }



        <Button
          type="submit"
          size="large"
          variant="contained"
          disabled={ loading }
          endIcon={ <ChevronRight /> }
          sx={ {
            py: 1.5, mt: 3, fontSize: '16px', fontWeight: 600, textTransform: 'none', borderRadius: '8px', bgcolor: '#007DFA',
            '&:hover': {
              bgcolor: '#0066CC'
            }
          } }
        >
          { loading ? 'Signing in...' : 'Sign In' }
        </Button>

        <Divider sx={ { mt: 3 } } />

        <Box sx={ { mt: 3 } }>
          <Typography variant="body2" color="text.secondary">
            Dont have an account?{ ' ' }
            <Link
              component="button"
              onClick={ ( e ) => {
                e.preventDefault();
                handleSignupRedirect();
              } }
              sx={ {
                cursor: 'pointer',
                color: '#007DFA',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              } }
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Login;