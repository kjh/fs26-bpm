import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import { fi } from 'date-fns/locale/fi'
registerLocale('fi', fi)

const EditableDateRange = ({ field, valueStyle, uniqueFieldId }) => {
  const [isEditing, setIsEditing] = useState(false)
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

  return (
    <>
      {isEditing ? (
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
              setIsEditing(false)
            } /*else if (!startUpdate && !endUpdate) {
              setIsEditing(false) // isClearable 
            }*/

            setValue(fieldStr)
          }}
          open={true}
          onClickOutside={() => setIsEditing(false)} 
          shouldCloseOnSelect={false}  
          style={{ width: 'auto' }}
          //isClearable={true} jos ei pakollinen
          placeholderText="Select date range"
          locale="fi"
          dateFormat="dd.MM.yyyy"
          className="form-input daterange-picker"
          wrapperStyle={{ display: "inline-block", width: "auto" }}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            ...valueStyle,
            cursor: 'pointer',
          }}
        >
          {String(value).replace(',', ' ')}
        </div>
      )}
    </>
  )
}

export default EditableDateRange
