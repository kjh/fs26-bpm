import { Drawer, Box, Typography, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DynamicForm from './DynamicForm'

const AddRecordDrawer = ({
  process,
  isAddingNewRecord,
  handleCloseNew,
  addRecord,
}) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(isAddingNewRecord)}
      onClose={handleCloseNew}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      <Box
        sx={{
          width: { xs: '100vw', sm: '450px' },
          height: '100%',
          backgroundColor: '#fff',
          color: '#000',
          padding: 3,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Add Record
          </Typography>
          <IconButton onClick={handleCloseNew} sx={{ color: '#000' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isAddingNewRecord && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <DynamicForm
              phases={process.phases}
              addRecord={addRecord}
              process_id={process.id}
              phase_id={process.phases[0].id}
              fields={process.field_definitions}
            />
          </Box>
        )}

        <Box
          sx={{
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={handleCloseNew}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default AddRecordDrawer
