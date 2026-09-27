import { Link } from 'react-router-dom'
const ProcessList = ({ processes }) => {
  return (
    <div>
      <h1>Processes</h1>

      <ul>
        {processes &&
          processes.map((process) => (
            <li key={process.name}>
              <Link to={`/processes/${process.id}`}>{process.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default ProcessList
