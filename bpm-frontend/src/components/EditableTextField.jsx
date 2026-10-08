import { useState, useEffect } from 'react'

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
    <>
      {isEditing ? (
        <div key={field.id} style={valueStyle}>
          <label
            style={{
              fontSize: '0.85rem',
              color: '#000',
              fontWeight: 'bold',
              display: 'block',
              marginBottom: '4px',
            }}
            htmlFor={uniqueFieldId}
          >
            {field.field_definition?.name}
            {`${inputType === 'number' && unit ? ` (${unit})` : ''}`}
          </label>

          <input
            id={uniqueFieldId}
            name={field._id || field.id}
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Empty"
            className="inline-editable-input"
            autoFocus={focusedFieldId === uniqueFieldId}
          />
        </div>
      ) : (
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#000',
              fontWeight: 'bold',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            {field.field_definition?.name}
          </div>
          {value ? (
            <>
              {`${String(value)}${inputType === 'number' && unit ? ` ${unit}` : ''}`}
            </>
          ) : (
            <em>Empty</em>
          )}
        </div>
      )}
    </>
  )
}

export default EditableTextField
