import { useState, useEffect } from 'react'

const EditableSelectField = ({
  field,
  valueStyle,
  uniqueFieldId,
  isEditing,
  fieldsRef,
  focusedFieldId,
}) => {
  const [value, setValue] = useState(field.value)
  const options = field.field_definition?.options || ['Empty']

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

          <select
            id={uniqueFieldId}
            name={field._id || field.id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="inline-editable-input"
            autoFocus={focusedFieldId === uniqueFieldId}
          >
            {options.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              )
            })}
          </select>
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
          {value ? <>{String(value)}</> : <em>Empty</em>}
        </div>
      )}
    </>
  )
}

export default EditableSelectField
