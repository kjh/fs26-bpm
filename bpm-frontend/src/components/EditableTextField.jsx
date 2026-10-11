import { useState, useEffect } from 'react'
import { Box, Typography, TextField } from '@mui/material'

const EditableTextField = ({
  field,
  valueStyle,
  inputType,
  uniqueFieldId,
  isEditing,
  fieldsRef,
  focusedFieldId,
}) => {
  const [value, setValue] = useState(field.value)
  const unit = field.field_definition?.options?.[0] || ''

  const fieldId = field._id || field.id

  useEffect(() => {
    if (!fieldsRef || !fieldsRef.current) return

    const originalValue = field.value

    if (isEditing && value !== originalValue) {
      fieldsRef.current[fieldId] = value
    } else {
      delete fieldsRef.current[fieldId]
    }

    return () => {
      if (fieldsRef && fieldsRef.current) {
        delete fieldsRef.current[fieldId]
      }
    }
  }, [value, isEditing, fieldId, fieldsRef, field.value])

  return (
    <Box key={field.id} sx={valueStyle}>
      {isEditing ? (
        <Box>
          <Typography
            component="label"
            htmlFor={uniqueFieldId}
            sx={{
              fontSize: '0.85rem',
              color: '#000',
              fontWeight: 'bold',
              display: 'block',
              mb: 0.5,
            }}
          >
            {field.field_definition?.name}
            {inputType === 'number' && unit ? ` (${unit})` : ''}
          </Typography>

          <TextField
            id={uniqueFieldId}
            name={field._id || field.id}
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Empty"
            autoFocus={focusedFieldId === uniqueFieldId}
            variant="standard"
            fullWidth
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '4px 0',
                fontSize: 'inherit',
                fontFamily: 'inherit',
              },
            }}
          />
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#000',
              fontWeight: 'bold',
              display: 'block',
              mb: 0.5,
            }}
          >
            {field.field_definition?.name}
          </Typography>

          {value ? (
            <Typography variant="body2">
              {`${String(value)}${inputType === 'number' && unit ? ` ${unit}` : ''}`}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              component="em"
              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
            >
              Empty
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default EditableTextField
