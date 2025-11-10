import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl,
  Button, Box, Typography, CircularProgress, Alert,
} from '@mui/material'
import { ImagePlus } from 'lucide-react'
import { useCreateProject } from '@/hooks/useCreateProject'

interface ModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddProject( { open, onClose, onSuccess }: ModalProps ) {
  const { formData, handleChange, handleLogoChange, submit, errors, loading, submitError, logoPreview, allUsers, usersLoading } = useCreateProject( onSuccess )

  const handleClose = () => {
    onClose()
  }

  const handleAdd = async () => {
    const success = await submit()
    if ( success ) {
      onClose()
    }
  }

  return (
    <Dialog open={ open } onClose={ handleClose } fullWidth>
      <DialogTitle sx={ { fontSize: '20px', fontWeight: 500, p: 3 } }>Add new Project</DialogTitle>

      <DialogContent sx={ { p: 3 } }>
        <Box sx={ { display: 'flex', gap: 3 } }>
          <Box sx={ { flex: 1, maxWidth: '340px' } }>
            { submitError && <Alert severity="error" sx={ { mb: 2 } }>{ submitError }</Alert> }

            <Box sx={ { mb: 2.5 } }>
              <Typography sx={ { fontSize: '14px', fontWeight: 500, mb: 1 } }>Project name</Typography>
              <TextField
                fullWidth
                placeholder="Enter project name"
                value={ formData.name }
                onChange={ ( e ) => handleChange( 'name', e.target.value ) }
                error={ !!errors.name }
                helperText={ errors.name }
                disabled={ loading }
                size="small"
              />
            </Box>

            <Box sx={ { mb: 2.5 } }>
              <Typography sx={ { fontSize: '14px', fontWeight: 500, mb: 1 } }>Short details</Typography>
              <TextField
                fullWidth
                placeholder="Enter details here"
                value={ formData.description }
                onChange={ ( e ) => handleChange( 'description', e.target.value ) }
                error={ !!errors.description }
                helperText={ errors.description }
                disabled={ loading }
                size="small"
              />
            </Box>

            <Box sx={ { mb: 2.5 } }>
              <Typography sx={ { fontSize: '14px', fontWeight: 500, mb: 1 } }>Assign to</Typography>
              <FormControl fullWidth size="small" disabled={ loading || usersLoading }>
                <Select
                  multiple
                  value={ formData.assignedUsers }
                  onChange={ ( e ) => handleChange( 'assignedUsers', typeof e.target.value === 'string' ? [] : e.target.value ) }
                  displayEmpty
                  renderValue={ ( selected ) => {
                    if ( allUsers.length === 0 ) return 'No users available'
                    return selected.map( id => allUsers.find( u => u.id === id )?.name || '' ).join( ', ' )
                  } }
                >
                  { allUsers.map( u => (
                    <MenuItem key={ u.id } value={ u.id }>{ u.name }</MenuItem>
                  ) ) }
                </Select>
              </FormControl>
            </Box>
          </Box>

          <LogoUpload logoPreview={ logoPreview } onLogoChange={ handleLogoChange } disabled={ loading } error={ errors.logo } />
        </Box>
      </DialogContent>

      <DialogActions sx={ { p: 3, gap: 1, mr:30 } }>
        <Button onClick={ handleAdd } disabled={ loading } variant="contained" sx={ { height: '40px', width: '150px', bgcolor: '#007DFA' } }>
          { loading ? <CircularProgress size={ 20 } sx={ { color: 'white', mr: 1 } } /> : null }
          { loading ? 'Adding...' : 'Add' }
        </Button>
        <Button onClick={ handleClose } disabled={ loading } sx={{height: '40px', width: '150px'}}>
          Cancel
        </Button>

      </DialogActions>
    </Dialog>
  )
}

interface LogoProps {
  logoPreview: string
  onLogoChange: ( file: File | null ) => void
  disabled: boolean
  error?: string
}

function LogoUpload( { logoPreview, onLogoChange, disabled, error }: LogoProps ) {
  return (
    <Box sx={ { flex: 0.5 } }>
      <Box
        component="label"
        sx={ {
          border: '2px dashed #E8E8E8',
          borderRadius: '8px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          opacity: 1,
          display: 'block',
          mt: 2
        } }
      >
        <input
          type="file"
          accept="image/png,image/gif"
          onChange={ ( e ) => onLogoChange( e.target.files?.[0] || null ) }
          style={ { display: 'none' } }
          disabled={ disabled }
        />

        { logoPreview ? (
          <Box
            component="img"
            src={ logoPreview }
            alt="preview"
            sx={ { maxWidth: '190px', maxHeight: '190px', borderRadius: '4px' } }
          />
        ) : (
          <Box sx={ { justifyContent: 'center', textAlign: 'center' } }>
            <ImagePlus size={ 50 } strokeWidth={ 1.5 } color="#9B9B9B" style={ { margin: '0 auto', marginBottom: '8px' } } />
            <Typography sx={ { color: '#9B9B9B', fontSize: '18px' } }>Upload logo</Typography>
          </Box>
        ) }
      </Box>
      { error && <Typography sx={ { color: '#d32f2f', fontSize: '12px', mt: 1 } }>{ error }</Typography> }
    </Box>
  )
}
