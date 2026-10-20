import { useParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import EditProcessForm from './EditProcessForm'
import processService from '../services/processes'

const EditProcess = ({ setNotificationMessage, updateProcess }) => {
  const { id } = useParams()
  const [process, setProcess] = useState(null)

  const loadProcess = useCallback(async () => {
    try {
      const initialProcess = await processService.get(id)
      setProcess(initialProcess)
      setNotificationMessage({ message: 'loaded process', type: 'info' })

      const timer = setTimeout(() => setNotificationMessage(null), 5000)
      return () => clearTimeout(timer)
    } catch (error) {
      setNotificationMessage({
        message: 'error loading process',
        type: 'error',
      })
      const timer = setTimeout(() => setNotificationMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [id, setNotificationMessage])

  useEffect(() => {
    loadProcess()
  }, [loadProcess])

  if (!process) {
    return <p>loading...</p>
  }

  return (
    <>
      <EditProcessForm
        key={`process-${process.id}`}
        process={process}
        updateProcess={updateProcess}
        reloadProcess={loadProcess}
      />
    </>
  )
}

export default EditProcess
