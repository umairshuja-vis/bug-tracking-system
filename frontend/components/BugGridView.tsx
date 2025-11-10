import { Card, Typography, CardContent, Avatar, Tooltip, Box, IconButton, Button, Divider, useTheme } from '@mui/material'
import { MoreVertical, Calendar } from 'lucide-react'
import { useStatusStyle } from '@/hooks/useStatusStyle'


export default function BugGridView( { bug, handleMenuOpen, setBugModalOpen, setSelectedBug, selectedBug } ) {
    const theme = useTheme()
    const { getStatusStyle } = useStatusStyle()

    const handleClick = ( bug ) => {
        setSelectedBug( bug )
        setBugModalOpen( true )
        console.log( "handleClick", selectedBug.title )
    }

    const statusStyle = getStatusStyle( bug.status )

    return (
        <Card sx={ { minWidth: 380, minHieght: 300, border: '1px solid #E0E0E0', borderRadius: 1, bgcolor: '#F7FAFC' } }>
            <CardContent>
                <Box sx={ {
                    display: 'flex', mb: 2, justifyContent: "space-between",
                    alignItems: "center",
                } }>
                    <Typography sx={ { fontSize: '16px', fontWeight: 600 } }>{ bug.title }</Typography>
                    <IconButton size="small" onClick={ ( e ) => handleMenuOpen( e, bug ) }>
                        <MoreVertical size={ 18 } color="#666" />
                    </IconButton>
                </Box>
                <Box sx={ { display: 'inline-block', bgcolor: statusStyle.bg, textTransform: 'capitalize', color: statusStyle.text, px: 1, py: 0.5, borderRadius: '6px', fontSize: 13, fontWeight: 500, mb: 2 } }>
                    { bug.status }
                </Box>
                <Divider />
                <Box sx={ {
                    display: 'flex', justifyContent: "space-between",
                    alignItems: "center", mt: 2
                } }>
                    <Typography variant="body2" sx={ { color: '#4C7399' } }>Due Date</Typography>
                    <Box sx={ { display: 'flex', gap: 0.5, mr: 2 } }>
                        <Calendar size={ 20 } />
                        <Typography>
                            { new Date( bug.deadline ).toLocaleDateString( 'en-US', { month: 'numeric', day: 'numeric', year: 'numeric' } ) }
                        </Typography>
                    </Box>
                </Box>
                <Box sx={ {
                    mt: 2, mb: 3, display: 'flex', justifyContent: "space-between",
                    alignItems: "center"
                } }>
                    <Typography variant="body2" sx={ { color: '#4C7399', } }>Assigned To</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', mr:2}}>
                        <Tooltip title={ bug.assignee.name }>
                            <Avatar sx={ { width: 29, height: 29, bgcolor: theme.palette.primary.main, fontSize: 12, fontWeight: 600, mr:1 } }>
                                D{ bug.assignee.id }
                            </Avatar>
                        </Tooltip>
                        <Typography>Assigned To</Typography>
                    </Box>

                </Box>
                <Divider sx={ { mb: 3 } } />
                <Button fullWidth variant="contained" sx={ {
                    bgcolor: '#E8EDF2', color: 'black', textTransform: 'none', fontWeight: '600', fontSize: '13.5px', borderRadius: '6px', letterSpacing: '0.3px'
                } }
                    onClick={ () => { handleClick( bug ) } }>
                    View Details
                </Button>
            </CardContent>
        </Card >
    )
}