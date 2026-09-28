import { useState } from 'react'

const EditableTextArea = ({ field, valueStyle }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(field.value)

  return (
    <div>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          rows={3}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            ...valueStyle,
            whiteSpace: 'pre-wrap',
            lineHeight: '1.5',
            cursor: 'pointer',
          }}
        >
          {String(value)}
        </div>
      )}
    </div>
  )
}

export default EditableTextArea
