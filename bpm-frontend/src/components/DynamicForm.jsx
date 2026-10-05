import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale/fi'
registerLocale('fi', fi)

const DynamicForm = ({ phases, addRecord, process_id, phase_id, fields }) => {
  console.log('DynamicForm fields: ', JSON.stringify(fields, null, 2))
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
    flexDirection: 'column',
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
      current_phase: phase_id, // luotaessa vain ensimmäinen vaihe sallittu
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
    console.log('phases', phases)
    return initialState
  }

  const [formData, setFormData] = useState(() => setInitialState())

  const handleChange = (name, value) => {
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
  const renderField = (field, id) => {
    const options = field.options || []

    switch (field.type) {
      case 'text':
        return (
          <input
            id={id}
            type="text"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'textarea':
        return (
          <textarea
            id={id}
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={3}
          />
        )

      case 'predefined':
        return (
          <select
            id={id}
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
              id={id}
              type="number"
              value={formData.fields[field.name]}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </>
        )

      case 'numeric':
        return (
          <input
            id={id}
            type="number"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'date':
        return (
          <input
            id={id}
            type="date"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onClick={(e) => {
              try {
                e.target.showPicker()
              } catch (err) {
                console.log('showPicker ei tuettu tässä selaimessa', err)
              }
            }}
          />
        )

      case 'time':
        return (
          <input
            id={id}
            type="time"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onClick={(e) => {
              try {
                e.target.showPicker()
              } catch (err) {
                console.log('showPicker ei tuettu tässä selaimessa', err)
              }
            }}
          />
        )

      case 'datetime':
        return (
          <input
            id={id}
            type="datetime-local"
            value={formData.fields[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onClick={(e) => {
              try {
                e.target.showPicker()
              } catch (err) {
                console.log('showPicker ei tuettu tässä selaimessa', err)
              }
            }}
          />
        )

      case 'date_range': {
        const fieldValue = formData.fields[field.name] || ''
        const [startStr, endStr] = fieldValue.split(',')

        const startDate = startStr ? new Date(startStr) : null
        const endDate = endStr ? new Date(endStr) : null

        const toISODateString = (date) => {
          if (!date) return ''
          const offset = date.getTimezoneOffset()
          const localDate = new Date(date.getTime() - offset * 60 * 1000)
          return localDate.toISOString().split('T')[0]
        }

        return (
          <DatePicker
            id={id}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              const [startUpdate, endUpdate] = update
              const startString = toISODateString(startUpdate)
              const endString = toISODateString(endUpdate)

              let fieldStr = ''
              if (startUpdate || endUpdate) {
                fieldStr = `${startString},${endString}`
              }

              handleFieldChange(field.name, fieldStr)
            }}
            style={{ width: 'auto' }}
            isClearable={true}
            placeholderText="Select date range"
            locale="fi"
            dateFormat="dd.MM.yyyy"
            className="form-input daterange-picker"
            wrapperStyle={{ display: 'inline-block', width: 'auto' }}
            autoComplete="off"
          />
        )
      }

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
              id={'field-title'}
              value={formData['title']}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="title"
            />
          </label>
          <label style={fieldGroupStyle}>
            <span style={labelStyle}>Phase</span>
            <select
              id={'field-select'}
              value={formData['current_phase']}
              onChange={(e) => handleChange('current_phase', e.target.value)}
            >
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {fields
          .filter((field) => {
            if (!field?.phases || !formData['current_phase']) {
              return false
            }
            const isNotFiltered = field.phases.some(
              (element) =>
                String(element.id || element._id) ===
                String(formData['current_phase']),
            )
            return isNotFiltered
          })
          .map((field) => {
            const uniqueFieldId = `field-${field.id}`
            return (
              <div key={field.id} style={fieldGroupStyle}>
                <label htmlFor={uniqueFieldId} style={labelStyle}>
                  {field.name}
                </label>
                {renderField(field, uniqueFieldId)}
              </div>
            )
          })}

        <button type="submit">save record</button>
      </form>
    </div>
  )
}

export default DynamicForm
