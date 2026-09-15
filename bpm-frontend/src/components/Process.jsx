import { useParams, useNavigate } from 'react-router-dom'

const Process = ({ process, deleteProcess }) => {
  const id = useParams().id
  const navigate = useNavigate()

  if (!process) {
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
      <h3>Process: {process.name}</h3>
      <button onClick={handleDelete}>delete</button>
      <h3>phases</h3>
      <ul>
        {process.phases.map(phase => (
          <li key={phase.id}>
            {phase.name}
          </li>
        ))}
      </ul>
      <h3>Fields</h3>
      <div>
        {process.field_definitions.map((field, index) => (
          <div style={{ display: 'flex', gap: '8px' }} key={index}>
              {field.name} - {field.type} - {field.phases.flatMap(p => p.name).join(', ')}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Process