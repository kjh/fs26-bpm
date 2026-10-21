import { AppBar, Toolbar, Box, Button, Container } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import KanbanIcon from '@mui/icons-material/Dashboard'
import { Link as RouterLink } from 'react-router-dom'

const TopAppBar = ({ user, handleLogout, handleAddNew, processId }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#3e3e3e',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ color: '#fff', textTransform: 'none', fontWeight: 500 }}
            >
              Home
            </Button>

            {!processId && (
              <Button
                component={RouterLink}
                to="/processes"
                sx={{ color: '#fff', textTransform: 'none', fontWeight: 500 }}
              >
                Processes
              </Button>
            )}

            {processId ? (
              <>
                <Button
                  onClick={handleAddNew}
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#fff',
                    borderColor: '#fff',
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 0, sm: 1 },
                    },
                    '&:hover': {
                      borderColor: '#eee',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'none', sm: 'inline', color: '#fff' },
                    }}
                  >
                    Add record
                  </Box>
                </Button>
                <Button
                  component={RouterLink}
                  to={`/processes/${processId}/records/kanban`}
                  variant="outlined"
                  color="secondary"
                  startIcon={<KanbanIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#fff',
                    borderColor: '#fff',
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 0, sm: 1 },
                    },
                    '&:hover': {
                      borderColor: '#eee',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'none', sm: 'inline', color: '#fff' },
                    }}
                  >
                    Kanban view
                  </Box>
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/create"
                variant="outlined"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  color: '#fff',
                  borderColor: '#fff',
                  '& .MuiButton-startIcon': {
                    marginRight: { xs: 0, sm: 1 },
                  },
                  '&:hover': {
                    borderColor: '#eee',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: 'none', sm: 'inline', color: '#fff' } }}
                >
                  Create process
                </Box>
              </Button>
            )}
          </Box>

          {user && (
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                color: '#fff',
                borderColor: '#fff',
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0, sm: 1 },
                },
                '&:hover': {
                  borderColor: '#eee',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline', color: '#fff' } }}
              >
                Logout
              </Box>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default TopAppBar
