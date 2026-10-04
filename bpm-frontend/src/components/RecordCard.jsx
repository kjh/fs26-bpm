import { useState, useRef } from 'react'
import EditableTextField from './EditableTextField'
import EditableTextArea from './EditableTextarea'
import EditableDateRange from './EditableDateRange'
import EditableSelectField from './EditableSelectField'

const RecordCard = ({ record, updateRecord }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [focusedFieldId, setFocusedFieldId] = useState(null)
  const fieldsRef = useRef({})

  const titleId = `field-title-${record.id}`

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #000',
    borderRadius: '16px',
    padding: '16px',
    maxWidth: '350px',
    marginBottom: '15px',
  }

  const titleStyle = {
    margin: '0 0 8px 0',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#000',
  }

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column', // nimi ja arvo allekkain
    gap: '4px',
    marginBottom: '12px',
  }

  const labelStyle = {
    fontSize: '0.85rem',
    color: '#000',
    fontWeight: 'bold',
  }

  const valueStyle = {
    fontSize: '1rem',
    color: '#000',
    backgroundColor: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid green',
  }

  const handleCardClick = (e, uniqueFieldId) => {
    console.log('title', record.title)
    if (!isEditing) {
      setIsEditing(true)
      setFocusedFieldId(uniqueFieldId)
      console.log('focus', focusedFieldId)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const updatedValues = fieldsRef.current
    console.log('Arvot', updatedValues)

    const updatedRecord = {}

    if (updatedValues && updatedValues[titleId] !== undefined) {
      const updatedtitle = updatedValues[titleId]
      delete updatedValues[titleId]
      updatedRecord['title'] = updatedtitle
    }

    if (updatedValues && Object.keys(updatedValues).length > 0) {
      updatedRecord['fields'] = updatedValues
    }
    updateRecord(record.process.id, record.id, updatedRecord)
    setIsEditing(false)
  }

  const renderField = (field, uniqueFieldId, isEditing) => {
    const type = field.field_definition?.type || 'text'

    switch (type) {
      case 'numeric':
        return (
          <EditableTextField
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'number'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'numeric_unit':
        return (
          <EditableTextField
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'number'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'date':
        return (
          <EditableTextField
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'date'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'datetime':
        return (
          <EditableTextField
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'datetime-local'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'date_range':
        return (
          <EditableDateRange
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'time':
        return (
          <EditableTextField
            field={field}
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'time'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'textarea':
        return (
          <EditableTextArea
            isEditing={isEditing}
            valueStyle={valueStyle}
            field={field}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      case 'predefined':
        return (
          <EditableSelectField
            isEditing={isEditing}
            valueStyle={valueStyle}
            inputType={'select'}
            field={field}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )

      default:
        return (
          <EditableTextField
            valueStyle={valueStyle}
            field={field}
            isEditing={isEditing}
            inputType={'text'}
            uniqueFieldId={uniqueFieldId}
            fieldsRef={fieldsRef}
            focusedFieldId={focusedFieldId}
          />
        )
    }
  }

  return (
    <div style={cardStyle}>
      <div
        onClick={(e) => handleCardClick(e, titleId)}
        key={titleId}
        style={{ ...titleStyle, marginBottom: '12px' }}
      >
        {renderField(
          {
            id: titleId,
            field_definition: { name: 'Title' },
            value: record.title,
          },
          titleId,
          isEditing,
          fieldsRef,
          focusedFieldId,
        )}
      </div>
      {record.fields.map((field, i) => {
        const fieldId = field.id || field._id
        const uniqueFieldId = `field-${i}-${fieldId}`

        return (
          <div
            onClick={(e) => handleCardClick(e, uniqueFieldId)}
            key={uniqueFieldId}
            style={{ marginBottom: '12px' }}
          >
            {renderField(
              field,
              uniqueFieldId,
              isEditing,
              fieldsRef,
              focusedFieldId,
            )}
          </div>
        )
      })}

      {isEditing && (
        <div onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default RecordCard
