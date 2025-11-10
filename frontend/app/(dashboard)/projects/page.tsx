"use client"

import { useProjects } from "@/hooks/useProjects"
import { Card, Grid, Typography, CardActionArea, Box, InputAdornment, Pagination, TextField, Button, Divider } from '@mui/material'
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { PlusIcon } from 'lucide-react'
import { AddProject } from "@/components/AddProject"
import Link from 'next/link'
import { Search } from 'lucide-react';



export default function ProjectsPage() {
  const { projects, loading, error, refetch } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchQuery, setSearchQuery] = useState( '' );
  const [modalOpen, setModalOpen] = useState( false );
  const itemsPerPage = 6;



  if ( loading ) return <p>Loading...</p>;
  if ( error ) return <p>Error: { error }</p>;
  if ( !isAuthenticated ) {

    return <p>You are not authorized to view this please<Link href="/login" className="text-blue-500 hover:text-blue-700 font-bold p-4">Login</Link></p>;
  }
  if ( !projects ) return <p>No projects found.</p>;


  const filteredProjects = projects.filter( project =>
    project.name.toLowerCase().includes( searchQuery.toLowerCase() ) ||
    project.description?.toLowerCase().includes( searchQuery.toLowerCase() )
  );

  const totalPages = Math.ceil( filteredProjects.length / itemsPerPage );
  const startIdx = ( currentPage - 1 ) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice( startIdx, startIdx + itemsPerPage );



  const handlePageChange = ( _event: React.ChangeEvent<unknown>, page: number ) => {
    setCurrentPage( page );
  };


  const isManager = user?.user_type === 'manager';
  return (
    <Box sx={ { px: '17vw', py: 4 } }>
      <Divider sx={ { mb: 2 } } />

      <Box sx={ { justifyContent: 'space-between', alignItems: 'center', p: 2, borderLeft: '5px solid #50A885' } }>
        <Typography sx={ { fontSize: 24, fontWeight: 600 } }>All Projects</Typography>

        <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: "space-between", width: '100%' } }>
          <Typography variant="body2">
            Hi { user?.name }, welcome to ManageBug
          </Typography>
          <Box sx={ { display: 'flex', alignItems: 'center' } }>
            <TextField
              placeholder="Search for Projects here"
              value={ searchQuery }
              onChange={ ( e ) => {
                setSearchQuery( e.target.value );
                setCurrentPage( 1 );
              } }
              size="small"
              sx={ { width: '280px', } }
              slotProps={ {
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={ 18 } />
                    </InputAdornment>
                  ),
                },
              } }
            />
            { isManager && (
              <Button
                onClick={ () => setModalOpen( true ) }
                variant="contained"
                startIcon={ <PlusIcon size={ 18 } /> }
                sx={ {
                  bgcolor: '#007DFA', fontSize: '14px', textTransform: 'none', fontWeight: 600, borderRadius: '6px', height: '40px', ml: 2, px: 2,
                  '&:hover': {
                    bgcolor: '#0066CC',
                  },
                } }
              >
                Add Project
              </Button>
            ) }
          </Box>
        </Box>

      </Box>

      <Divider sx={ { mb: 3 } } />

      <Grid container spacing={ 7 } columns={ { xs: 3, sm: 8, md: 12 } } sx={ {
        alignItems: "center", mb: 5, ml: 1.5
      } }>
        { paginatedProjects.map( ( project ) => (

          <Grid key={ project.id }>
            <Card
              sx={ {
                width: '375px', height: '202px', display: 'flex', top: '253px', left: '221px', borderRadius: '8.45px', p: 3,
                boxShadow: '0px 6.34px 19.01px 0px rgba(0, 0, 0, 0.06)',
              } }
            >
              <CardActionArea
                href={ `/projects/${project.id}/bugs` }
                component="a"
                disableRipple
                sx={ {
                  '& .MuiCardActionArea-focusHighlight': {
                    background: 'transparent',
                  }
                } }
              >
                <Box
                  sx={ {
                    width: '58px', height: '58px', bgcolor: '#C8E6C9', borderRadius: '8px', mb: 2,
                  } }
                >
                  <Image
                    src={ project.logo ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${project.logo}` : '/placeholder_logo.png' }
                    alt={ `${project.name}` }
                    width={ 58 }
                    height={ 58 }
                    style={ {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    } }
                  />
                </Box>

                <Typography variant="subtitle1">
                  { project.name }
                </Typography>

                <Typography
                  variant="caption"
                >
                  { project.description }
                </Typography>
                <Box sx={ { display: 'flex', gap: 0.5, width: '100%', mt: 1 } }>
                  <Typography
                    variant="subtitle2"
                  >
                    Task Done:
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={ { color: '#000000' } }
                  >
                    { project.tasks ? `${project.tasks.completed}/${project.tasks.total}` : 'Loading...' }
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ) ) }
      </Grid>
      
      <Box sx={ { display: 'flex', justifyContent: 'center', mt: 4, alignItems: 'flex-end' } }>
        <Pagination
          count={ totalPages }
          page={ currentPage }
          onChange={ handlePageChange }
        />
      </Box>


      <AddProject
        open={ modalOpen }
        onClose={ () => setModalOpen( false ) }
        onSuccess={ () => {
          setCurrentPage( 1 )
          refetch?.()
        } }
      />
    </Box>
  );
}