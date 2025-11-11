'use client';

import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layers, ListChecks } from 'lucide-react';
import Image from "next/image";


export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>( null );
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isProjectsPage = pathname?.includes( '/projects' );
  const isBugsPage = pathname?.includes( '/bugs' );

  const handleMenuOpen = ( event: React.MouseEvent<HTMLElement> ) => {
    setAnchorEl( event.currentTarget );
  };

  const handleMenuClose = () => {
    setAnchorEl( null );
  };

  const handleLogout = () => {
    logout();
    router.push( '/login' );
  };

  const getAvatarLetter = () => {
    return user?.name?.charAt( 0 ).toUpperCase() || 'U';
  };

  const getFirstName = () => {
    const fullName = user?.name.trim().split( ' ' ) || 'User';
    return fullName[0]
  }


  return (
    <div>
      <AppBar
        position="sticky"
        sx={ {
          bgcolor: '#FFFFFF',
          color: '#000000',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.01)',
          px: '16vw', pt: 1
        } }
      >
        <Toolbar sx={ { display: 'flex', justifyContent: 'space-between', } }>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
            <Image src='/logo.svg' width={ 30 } height={ 30 } alt='logo' />
            <Typography
              sx={ {
                fontSize: '20px',
                fontWeight: 600,
                ml: 0.5
              } }
            >
              Manage
              <span style={ { fontWeight: 400, color: '#666666' } }>Bug</span>
            </Typography>
          </Box>

          <Box sx={ { display: 'flex', gap: 4, flex: 1, ml: 6 } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Layers size={ 20 } color={ isProjectsPage ? "#007DFA" : "#000000" } />
              <Typography
                component="a"
                href="/projects"
                sx={ {
                  fontWeight: 500,
                  color: isProjectsPage ? '#007DFA' : '#000000',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#007DFA',
                  },
                } }
              >
                Projects
              </Typography>
            </Box>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <ListChecks size={ 20 } color={ isBugsPage ? "#007DFA" : "#000000" } />
              <Typography
                component="a"
                sx={ {
                  fontWeight: 500,
                  color: isBugsPage ? '#007DFA' : '#000000',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#007DFA',
                  },
                } }
              >
                Bugs
              </Typography>
            </Box>
          </Box>

          <Box sx={ { display: 'flex', alignItems: 'center', bgcolor: '#F5F5F7', border: '1px solid #F5F5F7', borderRadius:'8px', p:1 } }>
            <IconButton
              onClick={ handleMenuOpen }
              sx={ { p: 0, ml: 1 } }
            >
              <Avatar
                sx={ {
                  width: 35,
                  height: 35,
                  bgcolor: '#007DFA',
                  fontWeight: 600,
                } }
              >
                { getAvatarLetter() }
              </Avatar>
              <Typography sx={ { ml: 1, mt:0.3, fontSize: '16px', color: '#3B3F70' } }>{ getFirstName() }</Typography>

            </IconButton>

            <Menu
              anchorEl={ anchorEl }
              open={ Boolean( anchorEl ) }
              onClose={ handleMenuClose }
              anchorOrigin={ {
                vertical: 'bottom',
                horizontal: 'right',
              } }
              transformOrigin={ {
                vertical: 'top',
                horizontal: 'right',
              } }
            >
              <MenuItem
                onClick={ handleLogout }
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
