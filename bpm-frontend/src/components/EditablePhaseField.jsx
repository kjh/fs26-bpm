import { useState, useEffect } from 'react'

const EditablePhaseField = ({
  field,
  valueStyle,
  inputType,
  uniqueFieldId,
  isEditing,
  fieldsRef,
  focusedFieldId,
}) => {
  const [value, setValue] = useState(field.value)
  const options = field.field_definition?.options || ['Empty']
  const fieldId = field._id || field.id

  console.log('alku field.value', field.value)
  console.log('alku value', value)

  useEffect(() => {
    if (isEditing && fieldsRef && fieldsRef.current) {
      const originalValue = field.value || '' // propsista

      if (value !== originalValue) {
        // onko muuttunut
        fieldsRef.current[fieldId] = value
        console.log('Uusi arvo:', value)
      } else {
        delete fieldsRef.current[fieldId]
      }
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
            {options.map((phase, i) => {
              return (
                <option key={i} value={phase.id}>
                  {phase.name}
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
          {value ? (
            options.find((phase) => String(phase.id) === String(value))?.name ||
            'No selection'
          ) : (
            <em>Empty</em>
          )}
        </div>
      )}
    </>
  )
}

export default EditablePhaseField
