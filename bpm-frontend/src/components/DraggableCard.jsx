import { useState } from 'react'
import RecordCard from './RecordCard'
import { Card, CardContent, Box } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

const DraggableCard = ({ record, process, updateRecord, handleDragStart }) => {
  const [isDraggingFromHandle, setIsDraggingFromHandle] = useState(false)

  return (
    <Card
      draggable={isDraggingFromHandle}
      onDragStart={(e) => handleDragStart(e, record.id)}
      onDragEnd={() => setIsDraggingFromHandle(false)}
      sx={{
        position: 'relative',
        cursor: 'default',
        backgroundColor: '#f4f7f6',
      }}
    >
      <Box
        onMouseDown={() => setIsDraggingFromHandle(true)}
        onMouseUp={() => setIsDraggingFromHandle(false)}
        sx={{
          cursor: 'grab',
          display: 'inline-flex',
          m: 0.5,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Box sx={{ color: 'text.secondary', p: 0.5, display: 'flex' }}>
          <DragIndicatorIcon fontSize="small" />
        </Box>
      </Box>

      <CardContent sx={{ '&:last-child': { pb: 3 }, pt: 0 }}>
        <RecordCard
          record={record}
          updateRecord={updateRecord}
          phases={process.phases}
          readOnly={true}
        />
      </CardContent>
    </Card>
  )
}

export default DraggableCard
