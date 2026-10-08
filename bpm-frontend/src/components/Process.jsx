import { useParams, useNavigate, Link } from 'react-router-dom'

import RecordCard from './RecordCard'
import DynamicForm from './DynamicForm'
import Togglable from './Togglable'

const Process = ({
  process,
  deleteProcess,
  records,
  addRecord,
  updateRecord,
}) => {
  const id = useParams().id
  const navigate = useNavigate()

  if (!process || !records) {
    return null
  }

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
      <Togglable buttonLabel="Settings">
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
          {process.field_definitions.map((field) => (
            <div style={{ display: 'flex', gap: '8px' }} key={field.id}>
              {field.name} - {field.type} -{' '}
              {field.phases.flatMap((p) => p.name).join(', ')}
            </div>
          ))}
        </div>
      </Togglable>
      <Togglable buttonLabel="Add record">
        <h3>Add record</h3>
        <DynamicForm
          phases={process.phases}
          addRecord={addRecord}
          process_id={process.id}
          phase_id={process.phases[0].id}
          fields={process.field_definitions}
        />
      </Togglable>
      <h3>Records</h3>
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          updateRecord={updateRecord}
          phases={process.phases}
        />
      ))}
    </div>
  )
}

export default Process
