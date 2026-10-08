import { useState, useEffect } from 'react'

const EditableTextArea = ({
  field,
  valueStyle,
  uniqueFieldId,
  isEditing,
  fieldsRef,
  focusedFieldId,
}) => {
  const [value, setValue] = useState(field.value)

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
          </label>

          <textarea
            id={uniqueFieldId}
            name={field._id || field.id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Empty"
            rows={3}
            className="inline-editable-input"
            autoFocus={focusedFieldId === uniqueFieldId}
          />
        </div>
      ) : (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.5',
          }}
        >
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
          {value ? <>{String(value)}</> : <em>Empty</em>}
        </div>
      )}
    </>
  )
}

export default EditableTextArea
