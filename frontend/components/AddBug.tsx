import {
    Dialog, DialogContent, AppBar, Toolbar, DialogActions,
    TextField, Select, MenuItem, FormControl,
    Button, Box, Typography, Alert, Avatar, IconButton, Divider, AvatarGroup
} from '@mui/material'
import { CloudUpload, Plus, X, CalendarCheck } from 'lucide-react'
import { useCreateBug } from '@/hooks/useCreateBug'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

interface ModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    id: number
}

interface ImageProps {
    imagePreview: string
    onImageChange: ( file: File | null ) => void
    disabled: boolean
    error?: string
}

export function AddBug( { open, onClose, onSuccess, id }: ModalProps ) {
    const { formData, handleChange, handleImageChange, submit, errors, loading, submitError, imagePreview, developers, usersLoading } = useCreateBug( id, onSuccess )
    const [datePickerOpen, setDatePickerOpen] = useState( false )

    const handleClose = () => {
        onClose()
    }

    const handleAdd = async () => {
        const success = await submit()
        if ( success ) {
            onClose()
        }
    }

    const handleDateChange = ( newValue: Dayjs | null ) => {
        if ( newValue ) {
            handleChange( 'deadline', newValue.toISOString() )
        }
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


            <DialogContent sx={ { pt: 2 } }>

                <Typography sx={ { fontSize: '24px', fontWeight: 600, mb: 1 } }>Add new bug</Typography>

                { submitError && <Alert severity="error" sx={ { mb: 1 } }>{ submitError }</Alert> }
                <Divider sx={ { mb: 1, mx: -3 } } />
                <Box sx={ { display: 'flex', gap: 2, mb: 3 } }>
                    <Box sx={ { display: 'flex' } }>
                        <Typography sx={ { fontSize: '15px', mt: 1, mr: 1 } }>Assign to</Typography>

                        <FormControl size="small" error={ !!errors.bug_assignee }>
                            <Select
                                value={ formData.bug_assignee || '' }
                                onChange={ ( e ) => handleChange( 'bug_assignee', e.target.value as number ) }
                                disabled={ loading || usersLoading }
                                displayEmpty
                                renderValue={ ( selected ) => {
                                    if ( !selected ) {
                                        return (
                                            <Box sx={ { display: 'flex', alignItems: 'center', mt: 0.5 } }>
                                                <AvatarGroup max={ 3 }>
                                                    { developers.slice( 0, 2 ).map( dev => (
                                                        <Avatar key={ dev.id } sx={ { width: 22, height: 22, bgcolor: '#007DFA', fontSize: '12px', textTransform: 'capitalize' } }>D{ dev.id }</Avatar>
                                                    ) ) }
                                                    <Avatar sx={ { width: 22, height: 22 } }><Plus size={ 18 } /></Avatar>

                                                </AvatarGroup>
                                            </Box>
                                        )
                                    }
                                    const dev = developers.find( developer => developer.id === selected )

                                    return (
                                        <Box sx={ { display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.5 } }>
                                            <Avatar sx={ { width: 22, height: 22, bgcolor: '#007DFA', fontSize: '12px', textTransform: 'capitalize' } }>
                                                D{ dev?.id }
                                            </Avatar>
                                        </Box>
                                    )
                                } }
                                sx={ {
                                    minWidth: '80px',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-select': { py: 0.5, px: 1 }
                                } }
                            >
                                { developers.map( dev => (
                                    <MenuItem key={ dev.id } value={ dev.id }>
                                        <Box sx={ { display: 'flex', gap: 1, alignItems: 'center' } }>
                                            <Avatar sx={ { width: 24, height: 24, bgcolor: '#007DFA', fontSize: '11px', textTransform: 'capitalize' } }>
                                                D{ dev.id }
                                            </Avatar>
                                            <Typography sx={ { fontSize: '14px' } }>{ dev.name }</Typography>
                                        </Box>
                                    </MenuItem>
                                ) ) }
                            </Select>
                        </FormControl>
                        { errors.bug_assignee && <Typography sx={ { color: 'error.main' } }>{ errors.bug_assignee }</Typography> }
                    </Box>

                    <Box sx={ { display: 'flex' } }>
                        <Typography sx={ { fontSize: '15px', mb: 1, mt: 1 } }>Add due date</Typography>
                        <LocalizationProvider dateAdapter={ AdapterDayjs }>
                            <DateTimePicker
                                value={ dayjs( formData.deadline ) }
                                onChange={ handleDateChange }
                                disabled={ loading }
                                open={ datePickerOpen }
                                onClose={ () => setDatePickerOpen( false ) }
                                slotProps={ {
                                    textField: { sx: { display: 'none' } }
                                } }
                            />
                        </LocalizationProvider>
                        <IconButton
                            onClick={ () => setDatePickerOpen( true ) }
                            disabled={ loading }
                            sx={ { border: '1px dashed', ml: 2 } }

                        >
                            <CalendarCheck size={ 18 } color={ formData.deadline ? '#007DFA' : '#666' } />
                        </IconButton>
                        { errors.deadline && <Typography sx={ { color: 'error.main' } }>{ errors.deadline }</Typography> }
                    </Box>
                </Box>

                <Box sx={ { mb: 2 } }>
                    <TextField
                        fullWidth
                        placeholder="Add title here"
                        value={ formData.title }
                        onChange={ ( e ) => handleChange( 'title', e.target.value ) }
                        error={ !!errors.title }
                        helperText={ errors.title }
                        disabled={ loading }
                        variant="standard"
                        InputProps={ {
                            disableUnderline: true,
                            sx: { fontSize: '20px', color: formData.title ? '#000' : '#CCCCCC' }
                        } }
                    />
                </Box>

                <Box sx={ { mb: 2.5 } }>
                    <Typography sx={ { fontSize: '15px', mb: 1 } }>Bug details</Typography>
                    <TextField
                        fullWidth
                        placeholder="Add here"
                        value={ formData.description }
                        onChange={ ( e ) => handleChange( 'description', e.target.value ) }
                        error={ !!errors.description }
                        helperText={ errors.description }
                        disabled={ loading }
                        size="small"
                    />
                </Box>

                <Box sx={ { mb: 2.5 } }>
                    <Typography sx={ { fontSize: '15px', mb: 1 } }>Bug Type</Typography>
                    <FormControl fullWidth size="small" disabled={ loading } error={ !!errors.type }>
                        <Select
                            value={ formData.type }
                            onChange={ ( e ) => handleChange( 'type', e.target.value as string ) }
                        >
                            <MenuItem value="bug">Bug</MenuItem>
                            <MenuItem value="feature">Feature</MenuItem>
                        </Select>
                    </FormControl>
                    { errors.type && <Typography sx={ { color: '#error.main' } }>{ errors.type }</Typography> }
                </Box>

                <Box>
                    <Screenshot imagePreview={ imagePreview } onImageChange={ handleImageChange } disabled={ loading } error={ errors.screenshot } />
                </Box>
            </DialogContent>
            <DialogActions sx={{boxShadow: '0px 7px 28px 0px #00000040'}}>
                <Box sx={ { mt: 1, p:1, px:3, display: 'flex' ,justifyContent: 'flex-end' } }>
                    <Button
                        onClick={ handleAdd }
                        disabled={ loading }
                        variant="contained"
                        sx={ {
                            bgcolor: '#007DFA', px: 4, py: 1, borderRadius: '6px', textTransform: 'none'
                        } }>
                        { loading ? 'Adding...' : 'Add' }
                    </Button>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

function Screenshot( { imagePreview, onImageChange, disabled, error }: ImageProps ) {
    return (
        <Box sx={{mb: 10}}>
            <Box
                component="label"
                sx={ {
                    borderRadius: '8px', p: 3, display: 'block',
                } }
            >
                <input
                    type="file"
                    accept="image/png,image/gif"
                    onChange={ ( e ) => onImageChange( e.target.files?.[0] || null ) }
                    style={ { display: 'none' } }
                    disabled={ disabled }
                />

                { imagePreview ? (
                    <Box
                        component="img"
                        src={ imagePreview }
                        sx={ { maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', pl: 18 } }
                    />
                ) : (
                    <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
                        <CloudUpload size={ 30 } strokeWidth={ 1 } />
                        <Typography sx={ { color: '#9B9B9B', fontSize: '14px', p: 2 } }>
                            Drop any file here or <Typography component="span" sx={ { color: '#007DFA', fontWeight: 500 } }>browse</Typography>
                        </Typography>
                    </Box>
                ) }
            </Box>
            { error && <Typography sx={ { color: 'error.main' } }>{ error }</Typography> }
        </Box>
    )
}
