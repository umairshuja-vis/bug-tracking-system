'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';


type UserType = 'manager' | 'qa' | 'developer';

interface User {
  user_id: string;
  name: string;
  email: string;
  user_type: UserType | '';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: ( user_id: string, email: string, name: string, user_type: UserType, access_token: string ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>( undefined );

export function AuthProvider( { children }: { children: ReactNode } ) {
  const [isAuthenticated, setIsAuthenticated] = useState( false );
  const [user, setUser] = useState<User | null>( null );
  const [token, setToken] = useState<string | null>( null );
  const [loading, setLoading] = useState( true );
  const router = useRouter();



  useEffect( () => {
    const restoreSession = () => {
      const data = localStorage.getItem( 'access_token' );
      const userData = localStorage.getItem( 'user' );

      if ( data && userData ) {
        try {
          const parsedUser = JSON.parse( userData );
          setUser( parsedUser );
          setToken( data );
          setIsAuthenticated( true );
        } catch {
          localStorage.removeItem( 'access_token' );
          localStorage.removeItem( 'user' );
          setIsAuthenticated( false );
          router.push('/login')


        }
      }
      setLoading( false );
    };

    restoreSession();
  }, [router] );

  const login = ( user_id: string, email: string, name: string, user_type: UserType, access_token: string ) => {
    console.log( user_type, "HI" )
    const userData: User = { user_id, name, email, user_type };
    localStorage.setItem( 'access_token', access_token );
    localStorage.setItem( 'user', JSON.stringify( userData ) );
    //console.log(userData)
    setUser( userData );
    setToken( access_token );
    setIsAuthenticated( true );
  };

  const logout = () => {
    localStorage.removeItem( 'access_token' );
    localStorage.removeItem( 'user' );
    setUser( null );
    setToken( null );
    setIsAuthenticated( false );
  };

  return (
    <AuthContext.Provider value={ { isAuthenticated, user, token, loading, login, logout } }>
      { children }
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext( AuthContext );
  return context;
}
