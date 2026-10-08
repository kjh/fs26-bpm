import { useState, useEffect } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale/fi'
registerLocale('fi', fi)

const EditableDateRange = ({
  field,
  valueStyle,
  uniqueFieldId,
  isEditing,
  fieldsRef,
  focusedFieldId,
}) => {
  const [isEditingRange, setIsEditingRange] = useState(false)
  const [value, setValue] = useState(field.value)

  const fieldValue = value || ''
  const [startStr, endStr] = fieldValue.split(',')

  const startDate = startStr ? new Date(startStr) : null
  const endDate = endStr ? new Date(endStr) : null

  const toISODateString = (date) => {
    if (!date) return ''
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60 * 1000)
    return localDate.toISOString().split('T')[0]
  }

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
      {isEditing || isEditingRange ? (
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

          <DatePicker
            id={uniqueFieldId}
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

              if (startUpdate && endUpdate) {
                setIsEditingRange(false)
              } /*else if (!startUpdate && !endUpdate) {
              setIsEditing(false) // isClearable 
            }*/

              setValue(fieldStr)
            }}
            //open={true}
            onClickOutside={() => setIsEditingRange(false)}
            shouldCloseOnSelect={false}
            style={{ width: 'auto' }}
            //isClearable={true} jos ei pakollinen
            placeholderText="Select date range"
            locale="fi"
            dateFormat="dd.MM.yyyy"
            className="form-input daterange-picker"
            wrapperStyle={{ display: 'inline-block', width: 'auto' }}
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
          <div id={uniqueFieldId} onClick={() => setIsEditingRange(true)}>
            {String(value).replace(',', ' ')}
          </div>
        </div>
      )}
    </>
  )
}

export default EditableDateRange
