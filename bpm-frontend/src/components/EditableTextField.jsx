import { useState } from 'react'

const EditableTextField = ({ field, inputType }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(field.value)

  const fieldType = field.field_definition?.type

  const unit = field.field_definition?.options?.[0] || ''

  return (
    <div>
      {isEditing ? (
        <input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
          {value}
          {fieldType === 'numeric_unit' && unit ? ` ${unit}` : ''}
        </div>
      )}
    </div>
  )
}

export default EditableTextField
