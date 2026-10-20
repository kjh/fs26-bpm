import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'

import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Paper,
  Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Process = ({ process, deleteProcess }) => {
  const id = useParams().id
  const navigate = useNavigate()

  console.log('Top process')

  if (!process) {
    return null
  }

  const handleDelete = () => {
    if (window.confirm(`Delete process "${process.name}"?`)) {
      deleteProcess(id)
      navigate('/processes')
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          width: '100%',
          color: '#424242',
        }}
      >
        Process: {process.name}
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Button
        component={RouterLink}
        to={`/processes/${process.id}/records/kanban`}
        variant="contained"
        sx={{ mb: 4 }}
      >
        Kanban view
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          color="text.secondary"
        >
          Settings
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Button
            component={RouterLink}
            to={`/processes/${process.id}/edit`}
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            size="small"
          >
            Delete
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          color="text.secondary"
        >
          Phases
        </Typography>
        <List component="ol" sx={{ listStyleType: 'decimal', pl: 3 }}>
          {process.phases.map((phase) => (
            <ListItem key={phase.id} sx={{ display: 'list-item', py: 0.5 }}>
              <ListItemText primary={phase.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          color="text.secondary"
        >
          Field definitions
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {process.field_definitions.map((field) => (
            <Paper
              key={field.id}
              variant="outlined"
              sx={{ p: 2, bgcolor: 'background.default' }}
            >
              <Stack direction="row" spacing={3} sx={{ mb: 1.5 }}>
                <Typography variant="body1">
                  <strong>Name:</strong> {field.name}
                </Typography>
                <Chip
                  label={field.type}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Stack>

              {field.phases && field.phases.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Used in phases:
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap>
                    {field.phases.map((p) => (
                      <Chip
                        key={p.id}
                        label={p.name}
                        size="small"
                        color="default"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default Process
