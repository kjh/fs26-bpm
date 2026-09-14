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
    </div>
  )
}

export default Process