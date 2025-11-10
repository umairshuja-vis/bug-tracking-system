'use client'

import { useState, use } from 'react'
import { Box, Breadcrumbs, Typography, TextField, Paper, Grid, Table, Button, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton, Tooltip, Avatar, InputAdornment, MenuItem, useTheme, Menu, Divider, Select } from '@mui/material'
import { useBugs } from '@/hooks/useBugs'
import { useProjects } from '@/hooks/useProjects'
import { useStatusStyle } from '@/hooks/useStatusStyle'
import Link from 'next/link'
import { SearchIcon, MoreVertical, Calendar, ChevronRight, LayoutGrid, TextAlignJustify, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'
import { Bug, BugStatus } from '@/types/bug'
import { PlusIcon } from 'lucide-react'
import { AddBug } from "@/components/AddBug"
import { useAuth } from '@/context/AuthContext'
import { BugDetail } from '@/components/BugDetail'
import BugGridView from '@/components/BugGridView'
import { deleteBug, updateBugStatus } from '@/util/api'



interface BugsPageProps {
    params: Promise<{ id: string }>
}

const headers = ['BUG DETAILS', 'STATUS', 'DUE DATE', 'ASSIGNED TO', 'ACTION']

export default function BugsPage( { params }: BugsPageProps ) {
    const { id } = use( params )
    const parsedId = parseInt( id )
    const { bugs, loading, error, refetch } = useBugs( id )
    const { isAuthenticated, user, token } = useAuth()
    const { projects } = useProjects()
    const theme = useTheme()
    const { getStatusStyle, getStatusOptions } = useStatusStyle()
    const [page, setPage] = useState( 0 )
    const [rowsPerPage, setRowsPerPage] = useState( 10 )
    const [searchQuery, setSearchQuery] = useState( '' )
    const [modalOpen, setModalOpen] = useState( false );
    const [bugModalOpen, setBugModalOpen] = useState( false );
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>( null )
    const [selectedBug, setSelectedBug] = useState<Bug | null>( null )
    const [gridView, setGridView] = useState( false )
    const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'me' | 'others'>( 'all' )
    const [orderDesc, setOrderDesc] = useState<boolean>( false )
    const [submitError, setSubmitError] = useState<string | null>( null );


    const project = projects?.find( project => project.id === parseInt( id ) )

    if ( loading ) return <Box sx={ { px: 15, py: 4 } }><Typography>Loading...</Typography></Box>
    if ( error ) return <Box sx={ { px: 15, py: 4 } }><Typography color="error">Error: { error }</Typography></Box>

    const isQA = user?.user_type === 'qa';
    const isCreator = ( bug_creator: number ) => {
        return parseInt( user?.user_id ) == bug_creator
    }
    const isAssigned = ( bug_assignee: number ) => {
        return parseInt( user?.user_id ) == bug_assignee
    }

    const handleMenuOpen = ( event: React.MouseEvent<HTMLElement>, bug: Bug ) => {
        setAnchorEl( event.currentTarget )
        setSelectedBug( bug )
    }

    const handleMenuClose = () => {
        setAnchorEl( null )
        setSelectedBug( null )
    }

    const handleStatusChange = async ( newStatus: BugStatus ) => {
        if ( !selectedBug || !isAuthenticated ) return

        try {
            const res = await updateBugStatus( selectedBug.id, newStatus, token )
            const response = await res.json();

            if ( !res.ok ) {
                setSubmitError( response.message || 'update status failed' )
            }

            refetch?.()
            handleMenuClose()
        } catch ( err ) {
            setSubmitError( `error updating status: ${err}` )
        }
    }

    const handleDelete = async () => {
        if ( !selectedBug || !token ) return

        if ( !confirm( `confirm delete "${selectedBug.title}"?` ) ) {
            handleMenuClose()
            return
        }

        try {
            const res = await deleteBug( selectedBug.id, token )
            const response = await res.json();


            if ( !res.ok ) {
                setSubmitError( response.message || 'failed to delete bug' );
                return

            }
            refetch?.()
            handleMenuClose()
        } catch ( err ) {
            setSubmitError( `error deleting bug: ${err}` )
        }
    }


    const filteredBugs = bugs?.filter( bug => {
        const filtered = bug.title.toLowerCase().includes( searchQuery.toLowerCase() ) ||
            bug.description.toLowerCase().includes( searchQuery.toLowerCase() )

        if ( orderDesc ) {
            bugs?.sort( ( a, b ) => a.title.localeCompare( b.title ) )
        }
        else {
            bugs?.sort( ( a, b ) => b.title.localeCompare( a.title ) )
        }

        if ( assigneeFilter === 'me' ) {

            return filtered && bug.bug_assignee == parseInt( user?.user_id )
        } else if ( assigneeFilter === 'others' ) {
            return filtered && bug.bug_assignee != parseInt( user?.user_id )
        }

        return filtered
    } ) || []


    return (
        <Box sx={ { px: '17vw', py: 2 } }>
            <Divider sx={ { mb: 2 } } />

            <Box sx={ {} }>
                <Breadcrumbs sx={ { mb: 2 } } separator={ <ChevronRight /> }>
                    <Link href="/projects" style={ { color: theme.palette.primary.main } }>Projects</Link>
                    <Typography sx={ { color: theme.palette.text.secondary } }>{ project?.name || 'Project' }</Typography>
                </Breadcrumbs>
            </Box>

            <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 } }>
                <Box sx={{display:'flex', alignItems: 'center', gap: 2}}>
                    <Typography variant="h1">All bugs listing</Typography>
                    <Typography variant="subtitle2" color={theme.palette.error.main} sx={{bgcolor: theme.palette.error.light, px: 1, py: 0.75, borderRadius: '4px', textTransform: 'capitalize', fontSize: 13, fontWeight: 500, lineHeight: '15px', mt:1 }}>Bugs</Typography>
                </Box>

                { isQA && (
                    <Button
                        onClick={ () => setModalOpen( true ) }
                        variant="contained"
                        fullWidth
                        startIcon={ <PlusIcon size={ 20 } /> }
                        sx={ {
                            bgcolor: '#007DFA', textTransform: 'none', fontSize: '14px', fontWeight: 600, borderRadius: '6px', height: '40px', width: '120px', px: 2,
                            '&:hover': { bgcolor: '#0066CC' },
                        } }
                    >
                        New Task
                    </Button>
                ) }
            </Box>

            <Divider sx={ { mb: 3 } } />

            <Box sx={ { display: 'flex', gap: 2, alignItems: 'center', justifyContent: "space-between", mb: 3 } }>
                <TextField
                    placeholder="Search"
                    value={ searchQuery }
                    onChange={ ( e ) => { setSearchQuery( e.target.value ); setPage( 0 ) } }
                    size="small"
                    sx={ { flex: 1, maxWidth: 250 } }
                    InputProps={ {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon size={ 20 } color={ theme.palette.text.secondary } />
                            </InputAdornment>
                        ),
                    } }
                />


                <Box sx={ { display: 'flex', gap: 1 } }>
                    <Select
                        value={ assigneeFilter }
                        onChange={ ( e ) => { setAssigneeFilter( e.target.value as 'all' | 'me' | 'others' ); setPage( 0 ) } }
                        size="small"
                        sx={ {
                            minWidth: 130, maxHeight: 32, '& fieldset': { border: 'none' },
                        } }
                    >
                        <MenuItem value="all">Assigned To</MenuItem>
                        <MenuItem value="me">Me</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                    </Select>

                    <IconButton
                        onClick={ () => setOrderDesc( prev => !prev ) }
                        size="small"
                    >
                        { orderDesc ? < ArrowUpWideNarrow size={ 20 } /> : <ArrowDownWideNarrow size={ 20 } /> }
                    </IconButton>

                    <IconButton
                        onClick={ () => setGridView( true ) }
                        size="small"
                        sx={ { color: gridView ? theme.palette.primary.main : theme.palette.text.secondary } }
                    >
                        <LayoutGrid size={ 20 } />
                    </IconButton>

                    <IconButton
                        onClick={ () => setGridView( false ) }
                        size="small"
                        sx={ { color: !gridView ? theme.palette.primary.main : theme.palette.text.secondary } }
                    >
                        <TextAlignJustify size={ 20 } />
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={ { mb: 3 } } />



            { gridView ? (
                <Grid container spacing={ 6 } columns={ { xs: 3, sm: 8, md: 12 } } sx={ {
                    alignItems: "center",
                } }>
                    { filteredBugs.map( bug => (
                        <Grid key={ bug.id }>
                            <BugGridView
                                bug={ bug }
                                handleMenuOpen={ handleMenuOpen }
                                setBugModalOpen={ setBugModalOpen }
                                setSelectedBug={ setSelectedBug }
                                selectedBug={ selectedBug } />
                        </Grid>
                    ) ) }
                </Grid>
            ) : (
                <Paper sx={ { boxShadow: 'none', border: `1px solid #E0E0E0` } }>
                    <TableContainer >
                        <Table >
                            <TableHead >
                                <TableRow sx={ { bgcolor: '#F9FAFC', lineHeight: '25px', } }>
                                    { headers.map( header => (
                                        <TableCell key={ header } align={ header === 'BUG DETAILS' ? 'left' : 'center' } sx={ { fontWeight: 600, letterSpacing: '0.2px', fontSize: 12.5, color: '#666', textTransform: 'uppercase', borderRight: '1px solid #E0E0E0' } }>
                                            { header }

                                        </TableCell>
                                    ) ) }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { filteredBugs.slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage ).map( ( bug: Bug ) => {
                                    const statusStyle = getStatusStyle( bug.status )
                                    return (
                                        <TableRow key={ bug.id } hover>
                                            <TableCell>
                                                <Box sx={ { display: 'flex', gap: 1.5, alignItems: 'center' } }>

                                                    <Box sx={ { width: 8, height: 8, borderRadius: '50%', bgcolor: bug.type === 'bug' ? theme.palette.error.main : theme.palette.success.main } } />
                                                    <Typography sx={ { fontSize: 14, color: '#3A3541AD', fontWeight: 500 } }>{ bug.title }</Typography>
                                                </Box>
                                            </TableCell>


                                            <TableCell align="center">
                                                <Box sx={ { display: 'inline-block', bgcolor: statusStyle.bg, color: statusStyle.text, px: 1, py: 0.75, borderRadius: '6px', textTransform: 'capitalize', fontSize: 13, fontWeight: 500, lineHeight: '20.5px' } }>
                                                    { bug.status }
                                                </Box>

                                            </TableCell>
                                            <TableCell align="center">

                                                <Tooltip title={ new Date( bug.deadline ).toLocaleString() }>
                                                    <Box sx={ { display: 'inline-flex' } }>
                                                        <Calendar size={ 18 } color="#4C7399" />
                                                    </Box>

                                                </Tooltip>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Tooltip title={ bug.assignee.name }>

                                                    <Avatar sx={ { width: 28, height: 28, bgcolor: theme.palette.primary.main, fontSize: 13, fontWeight: 600, mx: 'auto' } }>
                                                        D{ bug.assignee.id }
                                                    </Avatar>
                                                </Tooltip>

                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={ ( e ) => handleMenuOpen( e, bug ) }
                                                >
                                                    <MoreVertical size={ 18 } color="#666" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } ) }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={ [10, 15, 20] }
                        component="div"
                        count={ filteredBugs.length }
                        rowsPerPage={ rowsPerPage }
                        page={ page }
                        onPageChange={ ( _, newPage ) => setPage( newPage ) }
                        onRowsPerPageChange={ ( e ) => { setRowsPerPage( +e.target.value ); setPage( 0 ) } }
                    />
                </Paper>

            ) }


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
                { selectedBug && isAssigned( selectedBug.bug_assignee ) && (
                    getStatusOptions( selectedBug.type ).map( ( status ) => {
                        const statusStyle = getStatusStyle( status )
                        return (
                            <MenuItem
                                key={ status }
                                onClick={ () => handleStatusChange( status ) }
                                sx={ { textTransform: 'capitalize' } }>
                                <Box sx={ { display: 'inline-block', bgcolor: statusStyle.bg, color: statusStyle.text, px: 1, py: 0.4, lineHeight: '20px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 500, fontSize: '11.5px' } }>
                                    { status }
                                </Box>
                            </MenuItem>
                        )
                    }
                    ) ) }

                { selectedBug && isAssigned( selectedBug.bug_assignee ) && ( <Divider /> ) }


                { selectedBug && isCreator( selectedBug.bug_creator ) && (
                    <MenuItem
                        onClick={ handleDelete }
                        sx={ { fontSize: '14px', py: 1, px: 2, color: 'error.main' } }>
                        Delete
                    </MenuItem>
                ) }

                <MenuItem
                    onClick={ () => setBugModalOpen( true ) }
                    sx={ { fontSize: '14px', py: 1, px: 2 } }>

                    View Details
                </MenuItem>
            </Menu>


            <AddBug
                open={ modalOpen }
                onClose={ () => setModalOpen( false ) }
                onSuccess={ () => {
                    refetch?.()
                } }
                id={ parsedId }
            />

            { selectedBug && (
                <BugDetail
                    open={ bugModalOpen }
                    onClose={ () => setBugModalOpen( false ) }
                    id={ selectedBug.id }
                />
            ) }

            { submitError && <Typography sx={ { my: 2, ml: 2 } } color={ theme.palette.error.main }>{ submitError }</Typography> }

        </Box>
    )
}
