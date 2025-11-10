'use client'
import { useBug } from '@/hooks/useBug'
import { useStatusStyle } from '@/hooks/useStatusStyle'
import {
    Dialog, DialogContent, AppBar, Toolbar,
    TextField, Select, MenuItem, FormControl, Tooltip, Divider, Box, Typography, Avatar, IconButton, useTheme
} from '@mui/material'
import { X, CalendarCheck } from 'lucide-react'
import Image from "next/image"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



interface ModalProps {
    open: boolean
    onClose: () => void
    id: number
}
export const BugDetail = ( { open, onClose, id }: ModalProps ) => {

    const { loading, bug } = useBug( id );
    const theme = useTheme();
    const { getStatusStyle } = useStatusStyle();
    const handleClose = () => {
        onClose()
    }
    return (
        <Dialog open={ open } onClose={ handleClose } maxWidth="sm" fullWidth
            PaperProps={ { sx: { borderRadius: '12px', maxWidth: '600px' } } }>

            <AppBar sx={ { position: 'relative', bgcolor: '#F5F6F8', boxShadow: 'none' } }>
                <Toolbar>
                    <IconButton onClick={ handleClose } disabled={ loading }
                        sx={ {
                            bgcolor: '#000', color: '#fff', width: 32, height: 32, borderRadius: '4.6px', marginLeft: 'auto',
                            '&:hover': { bgcolor: '#333' }
                        } }>
                        <X size={ 18 } />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <DialogContent sx={ { p: 3, } }>
                { loading ? (
                    <Typography>Loading...</Typography>
                ) : bug ? (
                    <>
                        <Box sx={ { display: 'flex', alignItems: 'center', gap: 3, mb: 2 } }>
                            <FormControl size="small" sx={ { minWidth: 150 } }>
                                <Select
                                    id="bug-status-id"
                                    value={ bug.status }
                                    inputProps={ { readOnly: true } }
                                    IconComponent= {ExpandMoreIcon}
                                    sx={ {
                                        color: getStatusStyle( bug.status ).text, bgcolor: getStatusStyle( bug.status ).bg, textTransform: 'capitalize',
                                        '.MuiOutlinedInput-notchedOutline': {
                                            border: 0,
                                        },
                                        '.MuiSelect-icon': {
                                            color: getStatusStyle( bug.status ).text,
                                        },
                                        fontSize: '16px', fontWeight: '600'

                                    } }
                                >
                                    <MenuItem value={ bug.status }>{ bug.status }</MenuItem>

                                </Select>
                            </FormControl>


                            <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
                                <Tooltip title={ bug.assignee.name }>
                                    <Avatar sx={ { width: 28, height: 28, bgcolor: theme.palette.primary.main, fontSize: 12, fontWeight: 600 } }>
                                        D{ bug.assignee.id }
                                    </Avatar>
                                </Tooltip>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={ { mb: -2, mt: -4, ml: 15 } } />

                            <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5, } }>
                                <Typography sx={ { fontSize: '12px', color: '#9592984D', fontWeight: 600 } }>CREATED</Typography>
                                <Typography sx={ { fontSize: '12px', color: '#999' } }>
                                    { new Date( bug.createdAt ).toLocaleDateString( 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } ) }
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem variant='fullWidth' />

                            <Tooltip title={ `Deadline: ${new Date( bug.deadline ).toLocaleString()}` }>
                                <Box sx={ {
                                    display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, border: '1px dashed #8D98AA', borderRadius: '18px'
                                } }>
                                    <CalendarCheck size={ 20 } color="#8D98AA" />
                                </Box>
                            </Tooltip>
                        </Box>

                        <Divider sx={ { mb: 2, mx:-3 } } />

                        <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 } }>
                            <Typography sx={ { fontSize: '24px', fontWeight: 600 } }>{ bug.title }</Typography>
                        </Box>

                        <Box sx={ { mb: 3, maxWidth: '400px', mx: 'auto', justifyContent: 'center', border: 'none' } }>
                            <Image
                                src={ bug.screenshot ? `${process.env.NEXT_PUBLIC_BASE_URL}${bug.screenshot}` : '/placeholder_logo.png' }
                                alt={ `${bug.title}` }
                                width={ 300 }
                                height={ 200 }
                                style={ { width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '20px' } }
                            />
                        </Box>

                        <Box sx={ { mb: 2.5 } }>
                            <Typography sx={ { fontSize: '14px', fontWeight: 600, mb: 1 } }>Bug details</Typography>
                            <TextField
                                fullWidth
                                value={ bug.description }
                                multiline
                                rows={ 2 }
                                size="small"
                                slotProps={ {
                                    input: {
                                        readOnly: true,
                                    },
                                } }
                            />
                        </Box>
                    </>
                ) : (
                    <Typography>Bug not found</Typography>
                ) }

            </DialogContent>
        </Dialog >
    );
}