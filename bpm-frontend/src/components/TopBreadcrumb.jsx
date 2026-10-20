import React from 'react'
import { Link as RouterLink, useMatch } from 'react-router-dom'
import { Box, Breadcrumbs, Link, Typography, Container } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const TopBreadcrumb = ({ process }) => {
  const match = useMatch('/processes/:id/*')
  const processId = match?.params?.id
  const matchKanban = useMatch('/processes/:id/records/kanban')
  const matchProcessesList = useMatch('/processes')

  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon
          fontSize="small"
          sx={{ my: 1, color: 'text.secondary' }}
        />
      }
      aria-label="breadcrumb"
      sx={{ mx: 2 }}
    >
      <Link
        component={RouterLink}
        underline="hover"
        color="text.secondary"
        to="/"
        sx={{ fontSize: '0.875rem', '&:hover': { color: '#009a67' } }}
      >
        Home
      </Link>

      {(processId || matchProcessesList) && (
        <Link
          component={RouterLink}
          underline="hover"
          color="text.secondary"
          to="/processes"
          sx={{ fontSize: '0.875rem', '&:hover': { color: '#009a67' } }}
        >
          processes
        </Link>
      )}

      {processId && (
        <Link
          component={RouterLink}
          underline="hover"
          color="text.secondary"
          to={`/processes/${process?.id || ''}`}
          sx={{ fontSize: '0.875rem', '&:hover': { color: '#009a67' } }}
        >
          {process?.name || 'process name'}
        </Link>
      )}
      {matchKanban && (
        <Link
          component={RouterLink}
          underline="hover"
          color="text.secondary"
          to={`/processes/${process?.id || ''}/records/kanban`}
          sx={{ fontSize: '0.875rem', '&:hover': { color: '#009a67' } }}
        >
          {'kanban'}
        </Link>
      )}
    </Breadcrumbs>
  )
}

export default TopBreadcrumb
