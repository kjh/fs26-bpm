import { useParams, useNavigate, Link } from 'react-router-dom'

import RecordCard from './RecordCard'
import DynamicForm from './DynamicForm'

const Process = ({ process, deleteProcess, records, addRecord }) => {
  const id = useParams().id
  const navigate = useNavigate()

  if (!process || !records) {
    return null
  }

  console.log('records', records)

  const handleDelete = () => {
    if (window.confirm(`Delete process "${process.name}"?`)) {
      deleteProcess(id)
      navigate('/processes')
    }
  }

  return (
    <div>
      <Link to={`/processes/${process.id}/records`}>records</Link>
      <h3>Process: {process.name}</h3>
      <h3>Settings</h3>
      <button onClick={handleDelete}>delete</button>
      <h3>Phases</h3>
      <ul>
        {process.phases.map((phase) => (
          <li key={phase.id}>{phase.name}</li>
        ))}
      </ul>
      <h3>Field definitions</h3>
      <div>
        {process.field_definitions.map((field, i) => (
          <div style={{ display: 'flex', gap: '8px' }} key={i}>
            {field.name} - {field.type} -{' '}
            {field.phases.flatMap((p) => p.name).join(', ')}
          </div>
        ))}
      </div>
      <h3>Add record</h3>
      <DynamicForm
        addRecord={addRecord}
        process_id={process.id}
        phase_id={process.phases[0].id}
        fields={process.field_definitions}
      />
      <h3>Records</h3>
      <div>
        {records.map((record, i) => (
          <RecordCard record={record} />
        ))}
      </div>
    </div>
  )
}

export default Process
