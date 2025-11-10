'use client'
import * as React from 'react';
import { Box, Avatar } from '@mui/material'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';
import { useRouter } from 'next/navigation'
import { ArrowRight, User, Briefcase, Laptop } from 'lucide-react';


const cards = [
  {
    id: 1,
    title: 'Manager',
    type: 'manager',
    description: 'Signup as a manager to manage the tasks',
    icon: <User />
  },
  {
    id: 2,
    title: 'Developer',
    type: 'developer',
    description: 'Signup as a Developer to assign the relevant task to QA',
    icon: <Briefcase />

  },
  {
    id: 3,
    title: 'QA',
    type: 'qa',
    description: 'Signup as a QA to create the bugs and report in tasks',
    icon: <Laptop />

  },
];


function JoinUs() {
  const router = useRouter()
  const title = 'Join Us!'
  const subtitle = "To begin this journey, tell us what type of account you would be opening."


  const handleSelect = ( type: string ) => {
    router.push( `/signup?type=${type}` )
  }

  const handleLoginRedirect = () => {
    router.push( '/login' )
  }

  return (
    <Box sx={ { width: '100%', maxWidth: '430px' } }>
      <Box sx={ { mb: 4 } }>
        <Typography
          variant="h1"
          sx={ {
            fontSize: '28px',
            fontWeight: 700,
            color: 'text.primary',
            mb: 1
          } }
        >
          { title }
        </Typography>
        <Typography
          variant="body2"
          sx={ {
            color: 'text.secondary',
            fontSize: '16px'
          } }
        >
          { subtitle }
        </Typography>
      </Box>

      <Box sx={ { display: 'grid', gap: 2, mb: 3 } }>
        { cards.map( ( card ) => (
          <Card
            key={ card.id }
            sx={ {
              borderRadius: '6px',
              boxShadow: '0px 4px 14px 1px #0000000A',
              border: '1px solid #f0f0f0',
              '&:hover': {
                borderColor: '#007DFA',
                boxShadow: '0 4px 20px rgba(0, 125, 250, 0.1)',
              },
              minHeight: '108px'

            } }
          >
            <CardActionArea
              onClick={ () => {
                handleSelect( card.type );
              } }
              sx={ { p: 1 } }
            >
              <CardContent sx={ {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                '&:hover': {
                  '.MuiAvatar-root': {
                    backgroundColor: '#007DFA',
                    color: 'white'
                  },

                },
              } }>
                <Box sx={ { mr: 2 } }>
                  <Avatar sx={ { bgcolor: 'white', color: '#2F3367', } }>
                    { card.icon }
                  </Avatar>
                </Box>
                <Box sx={ { mr: 3 } }>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={ {
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#2F3367',
                      mb: 0.5
                    } }
                  >
                    { card.title }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={ {
                      color: 'text.secondary',
                      fontSize: '14px',
                      fontWeight: '400'
                    } }
                  >
                    { card.description }
                  </Typography>
                </Box>
                <ArrowRight color='#007DFA' size={ 20 } />


              </CardContent>
            </CardActionArea>
          </Card>
        ) ) }
      </Box>

      <Box sx={ { mt: 4, textAlign: 'center', borderTop: '1px solid #f0f0f0', pt: 3 } }>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{ ' ' }
          <Link
            component="button"
            onClick={ ( e ) => {
              e.preventDefault();
              handleLoginRedirect();
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
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default JoinUs;
