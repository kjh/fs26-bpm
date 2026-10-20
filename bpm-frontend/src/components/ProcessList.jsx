import { useState } from 'react'
import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import ProcessCard from './ProcessCard'

const ProcessList = ({ processes }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProcesses = processes.filter((process) => {
    const query = searchQuery.toLowerCase().trim()

    if (!query) return true

    const matchesName = process.name?.toLowerCase().includes(query)

    const matchesPhases = process.phases?.some((phase) => {
      const phaseName = typeof phase === 'object' ? phase.name : phase
      return phaseName?.toLowerCase().includes(query)
    })

    return matchesName || matchesPhases
  })

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          width: '100%',
          color: '#424242',
        }}
      >
        Processes
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by process or phase name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          width: '100%',
          py: 2,
        }}
      >
        {filteredProcesses.map((process) => (
          <ProcessCard key={process._id || process.id} process={process} />
        ))}
      </Box>
    </>
  )
}

export default ProcessList
