import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FIELD_CATEGORIES = {
  "Text Content": [
    { value: "text", label: "Text" },
    { value: "predefined", label: "Predefined Options" },
    { value: "textarea", label: "Text Area" },
    { value: "subheader", label: "Subheader (header text field)" }
  ],
  "Numeric": [
    { value: "numeric", label: "Numeric" },
    { value: "numeric_unit", label: "Numeric Unit" }
  ],
  "Date & Time": [
    { value: "date", label: "Date" },
    { value: "date_range", label: "Date Range" },
    { value: "time", label: "Time" },
    { value: "time_range", label: "Time Range" },
    { value: "datetime", label: "Date & Time" },
    { value: "datetime_range", label: "Date & Time Range" }
  ]
}

const ProcessForm = ({ createProcess }) => {
  const [newProcessName, setNewProcessName] = useState('')
  const [newPhases, setNewPhases] = useState([])
  const [newFieldPhases, setNewFieldPhases] = useState([])
  const [newFieldDefinitions, setNewFieldDefinitions] = useState([])
  
  const [currentPhaseName, setCurrentPhaseName] = useState('')
  const [currentFieldName, setCurrentFieldName] = useState('')
  const [currentFieldType, setCurrentFieldType] = useState('')

  const navigate = useNavigate()

  const handlePhaseSelectChange = (event) => {
    event.preventDefault()
    const value = event.target.value
    if (value && !newFieldPhases.includes(value)) {
      setNewFieldPhases(newFieldPhases.concat(value))
    }
    event.target.value = ''
  }

  const handleAddField = (event) => {
    event.preventDefault()

    if (currentFieldName.trim() === '' || !currentFieldType || !newFieldPhases) return

    const field = {
      name: currentFieldName,
      type: currentFieldType,
      phases: newFieldPhases
    }

    setNewFieldDefinitions(newFieldDefinitions.concat(field))

    setCurrentFieldName('')
    setCurrentFieldType('')
    setNewFieldPhases([])
  }

  const handleAddPhase = (event) => {
    event.preventDefault()

    if (currentPhaseName.trim() === '') return

    setNewPhases(newPhases.concat(currentPhaseName))
    setCurrentPhaseName('')
  }

  const addProcess = async event => {
    event.preventDefault()
    const createdProcess = await createProcess({
      name: newProcessName,
      phases: newPhases,
      field_definitions: newFieldDefinitions,
    })
    
    setNewProcessName('')
    setNewPhases([])
    setNewFieldDefinitions([])

    if (createdProcess && createdProcess.id)
      navigate(`/processes/${createdProcess.id}`)
  }

  return (
    <div>
      <h2>Create a new process</h2>

      <form onSubmit={addProcess}>
        <div style={{ marginTop: '15px' }}>
          <label>
            Process name
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={newProcessName}
                onChange={event => setNewProcessName(event.target.value)}
                placeholder="process name"
              />
            </div>
          </label>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Add phases
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={currentPhaseName}
                onChange={(event) => setCurrentPhaseName(event.target.value)}
                placeholder="phase name"
              />
              <button type="button" onClick={handleAddPhase}>
                Add phase
              </button>
            </div>
          </label>
        </div>

        <div style={{ marginTop: '15px' }}>
          {newPhases.length > 0 && (
            <div>
              Phases
              {newPhases.map((phase, index) => (
                <div style={{ display: 'flex', gap: '8px' }} key={index}>{phase}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '15px' }}>
          {newFieldDefinitions.length > 0 && (
            <div>
              Fields
              {newFieldDefinitions.map((field, index) => (
                <div style={{ display: 'flex', gap: '8px' }} key={index}>{field.name} - {field.type} - {field.phases.join(', ')}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            Add new field to process
            <button type="button" onClick={handleAddField}>
              Add field
            </button>
          </div>
          <div>
            <label>
              Field name
              <div>
                <input
                  value={currentFieldName}
                  onChange={event => setCurrentFieldName(event.target.value)}
                  placeholder="field name"
                />
              </div>
            </label>
          </div>

          <div>
            <label>Type
              <select
                value={currentFieldType}
                onChange={(event) => setCurrentFieldType(event.target.value)}
                style={{ display: 'flex', gap: '8px' }}
              >
                <option value="" disabled>-- Select field type --</option>
                {Object.entries(FIELD_CATEGORIES).map(([category, options]) => (
                  <optgroup key={category} label={category}>
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Phases
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  onChange={handlePhaseSelectChange}
                  defaultValue=""
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <option value="" disabled>-- Select phase to add --</option>
                  {newPhases
                    .filter(phase => !newFieldPhases.includes(phase))
                    .map((phase, index) => (
                      <option key={index} value={phase}>{phase}</option>
                    ))
                  }
                </select>
              </div>
            </label>
          </div>

          <div style={{ marginTop: '15px' }}>
            {newFieldPhases.length > 0 && (
              <div>
                Active phases
                {newFieldPhases.map((phase, index) => (
                  <div style={{ display: 'flex', gap: '8px' }} key={index}>{phase}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <button type="submit">save</button>
        </div>
      </form>
    </div>
  )
}

export default ProcessForm