import { useState } from 'react'

const EditablePhaseField = ({
  field,
  valueStyle,
  uniqueFieldId,
  isEditing,
  focusedFieldId,
  handlePhaseChange,
}) => {
  const [value, setValue] = useState(field.value)
  const options = field.field_definition?.options || ['Empty']

  const handleChange = (e) => {
    setValue(e.target.value)
    handlePhaseChange(e.target.value)
  }

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
            onChange={(e) => handleChange(e)}
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
