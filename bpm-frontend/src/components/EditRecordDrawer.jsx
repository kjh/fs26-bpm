import { Drawer, Box, Typography, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RecordCard from './RecordCard'

const EditRecordDrawer = ({
  process,
  selectedRecord,
  handleClose,
  updateRecord,
}) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedRecord)}
      onClose={handleClose}
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
            Card
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#000' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedRecord && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              ID: {selectedRecord.id}
            </Typography>
            <RecordCard
              record={selectedRecord}
              updateRecord={updateRecord}
              phases={process.phases}
              readOnly={false}
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
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default EditRecordDrawer
