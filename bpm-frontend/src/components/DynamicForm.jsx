import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale/fi'
registerLocale('fi', fi)

const DynamicForm = ({ addRecord, process_id, phase_id, fields }) => {
  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #000',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '350px',
    marginTop: '15px',
    marginBottom: '15px',
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

  const setInitialState = () => {
    const initialState = {
      process_id,
      title: '',
      current_phase: phase_id,
      fields: {}, // aluksi object
    }

    fields.forEach((field) => {
      if (
        field.type === 'predefined' &&
        field.options &&
        field.options.length > 0
      ) {
        initialState.fields[field.name] = field.options[0]
      } else {
        initialState.fields[field.name] = ''
      }
    })

    console.log('form data initial state', initialState)
    console.log('fields', fields)
    return initialState
  }

  const [formData, setFormData] = useState(() => setInitialState())

  const handleTitleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handle submit')
    console.log('fields from process', fields)
    console.log('form data', formData)

    // luodaan array
    const formattedFields = Object.entries(formData.fields).map(
      ([fieldName, val]) => {
        const idFromName = fields.find((f) => f.name === fieldName)

        return {
          field_definition: idFromName.id,
          value: val,
        }
      },
    )

    const newRecord = {
      ...formData,
      fields: formattedFields,
    }

    console.log('newRecord payload', newRecord)
    createRecord(newRecord)
  }

  const createRecord = async (record) => {
    const createdRecord = await addRecord(record)
    console.log('createdRecord', createdRecord)
    setFormData(setInitialState)
  }

  // yksittäinen form input
  const renderField = (field) => {
    const options = field.options || []

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={3}
          />
        )

      case 'predefined':
        return (
          <select
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      case 'numeric_unit':
        const unit = options[0] || ''

        return (
          <>
            Unit: {unit}:
            <input
              type="number"
              value={formData.fields[field.name]}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={unit}
            />
          </>
        )

      case 'numeric':
        return (
          <input
            type="number"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'time':
        return (
          <input
            type="time"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'date_range':
        const fieldValue = formData.fields[field.name]
        const [startStr, endStr] = fieldValue.split(',')
        const startDate = startStr ? new Date(startStr) : null
        const endDate = endStr ? new Date(endStr) : null

        return (
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              const [startUpdate, endUpdate] = update

              const startString = startUpdate
                ? startUpdate.toLocaleDateString('fi-FI')
                : ''

              const endString = endUpdate
                ? endUpdate.toLocaleDateString('fi-FI')
                : ''

              let fieldStr = ''
              if (startUpdate || endUpdate) {
                fieldStr = `${startString},${endString}`
              }

              handleFieldChange(field.name, fieldStr)
            }}
            isClearable={true}
            placeholderText="Valitse aikaväli"
            locale="fi"
            dateFormat="dd.MM.yyyy"
            className="form-input daterange-picker"
          />
        )

      default:
        return null
    }
  }

  return (
    <div style={cardStyle}>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={fieldGroupStyle}>
            <span style={labelStyle}>Title</span>
            <input
              value={formData['title']}
              onChange={(e) => handleTitleChange('title', e.target.value)}
              placeholder="title"
            />
          </label>
        </div>
        {fields.map((field, index) => (
          <div key={index}>
            <label style={fieldGroupStyle}>
              <span style={labelStyle}>{field.name}</span>

              {renderField(field)}
            </label>
          </div>
        ))}

        <button type="submit">save record</button>
      </form>
    </div>
  )
}

export default DynamicForm
