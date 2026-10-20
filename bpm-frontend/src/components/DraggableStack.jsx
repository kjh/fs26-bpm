import { useState } from 'react'
import { Stack, Typography, Paper, TextField } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

const DraggableStack = ({ stackData, onOrderChange, onNameChange }) => {
  const [changedIndex, setChangedIndex] = useState(null)
  const [isDraggingFromHandle, setIsDraggingFromHandle] = useState(false)

  const handleDragStart = (e, index) => {
    setChangedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex) => {
    if (changedIndex === null || changedIndex === targetIndex) return

    const updatedList = [...stackData]
    const [changedItem] = updatedList.splice(changedIndex, 1)
    updatedList.splice(targetIndex, 0, changedItem)
    onOrderChange(updatedList)
    setChangedIndex(null)
    setIsDraggingFromHandle(false)
  }

  return (
    <Stack spacing={2} sx={{ marginTop: 5, maxWidth: 400 }}>
      <Typography variant="h6" fontWeight="bold">
        Process phases{' '}
        <Typography
          component="span"
          variant="body2"
          color="text.disabled"
          sx={{ fontStyle: 'italic', display: 'block', fontWeight: 'normal' }}
        >
          Rename or reorder
        </Typography>
      </Typography>

      <Stack spacing={1.5}>
        {stackData.map((item, index) => {
          return (
            <Paper
              key={item?.id || index}
              draggable={isDraggingFromHandle}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setIsDraggingFromHandle(false)}

              elevation={1}
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#fff',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
              }}
            >
              <div
                onMouseDown={() => setIsDraggingFromHandle(true)}
                onMouseUp={() => setIsDraggingFromHandle(false)}
                style={{
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <DragIndicatorIcon color="action" />
              </div>
              <TextField
                variant="standard"
                fullWidth
                value={item.name || ''}
                draggable="false"
                onDragStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onChange={(e) => onNameChange(index, item.id, e.target.value)}
                sx={{
                  input: { cursor: 'text' },
                }}
              />
            </Paper>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default DraggableStack
