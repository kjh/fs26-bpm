import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import DraggableCard from './DraggableCard'
import EditRecordDrawer from './EditRecordDrawer'
import SearchIcon from '@mui/icons-material/Search'

const KanbanBoard = ({ process, deleteRecord, updateRecord, records }) => {
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecords = records?.filter((record) => {
    const query = searchQuery.toLowerCase().trim()

    if (!query) return true

    const matchesTitle = record.title?.toLowerCase().includes(query)

    let phaseName = ''
    if (record.current_phase) {
      phaseName =
        typeof record.current_phase === 'object'
          ? record.current_phase.name
          : ''
    }
    const matchesPhase = phaseName?.toLowerCase().includes(query)

    const matchesField = record.fields?.some((field) => {
      if (!field) return false

      const rawValue = typeof field === 'object' ? field.value : field

      const fieldValue = String(rawValue || '')
      return fieldValue.toLowerCase().includes(query)
    })

    return matchesTitle || matchesPhase || matchesField
  })

  const handleClose = () => {
    setSearchQuery('')
    setSelectedRecord(null)
  }

  console.log('Top KanbanBoard')

  const { id } = useParams()

  if (!process || !records) return

  const handleDragStart = (e, recordId) => {
    e.dataTransfer.setData('text/plain', recordId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetPhase) => {
    e.preventDefault()
    const recordId = e.dataTransfer.getData('text/plain')

    const recordObject = records.find((record) => record.id === recordId)

    if (!recordObject) return

    const newRecord = {
      ...recordObject,
      current_phase: targetPhase,
    }

    console.log('Lähetetään', newRecord)
    await updateRecord(id, recordId, newRecord)
  }

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
        Kanban view
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
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
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f4f7f6',
        }}
      >
        <Grid
          container
          spacing={0.3}
          wrap="nowrap"
          sx={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            height: '100%',
            alignItems: 'stretch',
            padding: 1,
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {process.phases.map((phase) => {
            const phaseRecords = filteredRecords.filter(
              (r) => r.current_phase.id === phase.id,
            )

            return (
              <Grid
                key={phase.id}
                sx={{
                  flexShrink: 0,
                  width: { xs: '280px', sm: '320px' },
                }}
              >
                <Box
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, phase.id)}
                  sx={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: 3,
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: '#f8f8f8',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="h7"
                      sx={{
                        fontWeight: 'bold',
                        wordBreak: 'break-word',
                        width: '100%',
                        color: '#424242',
                      }}
                    >
                      {phase.name} ({phaseRecords.length})
                    </Typography>
                  </Box>

                  <Stack
                    spacing={0.5}
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      p: 0.5,
                    }}
                  >
                    {phaseRecords.map((record) => {
                      const cardKey = `${record.id}-${record.updatedAt || record.createdAt}`
                      return (
                        <Box
                          onClick={() => setSelectedRecord(record)}
                          key={cardKey}
                          sx={{ flexShrink: 0 }}
                        >
                          <DraggableCard
                            record={record}
                            process={process}
                            updateRecord={updateRecord}
                            handleDragStart={handleDragStart}
                          />
                        </Box>
                      )
                    })}

                    {phaseRecords.length === 0 && (
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ py: 4, color: '#b3b3b3' }}
                      >
                        Drop card here
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Grid>
            )
          })}
        </Grid>

        <EditRecordDrawer
          process={process}
          deleteRecord={deleteRecord}
          updateRecord={updateRecord}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          handleClose={handleClose}
        />
      </Box>
    </>
  )
}

export default KanbanBoard
