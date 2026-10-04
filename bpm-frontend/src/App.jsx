import { useState, useEffect } from 'react'
import processService from './services/processes'
import recordService from './services/records'
import loginService from './services/login'
import {
  getPersistentUser,
  savePersistentUser,
  removePersistentUser,
} from './services/persistentUser'

import { Routes, Route, Link, useMatch } from 'react-router-dom'

import ProcessList from './components/ProcessList'
import ProcessRecords from './components/ProcessRecords'
import Home from './components/Home'
import Footer from './components/Footer'
import ProcessForm from './components/ProcessForm'
import Process from './components/Process'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
  const [processes, setProcesses] = useState([])
  const [records, setRecords] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = getPersistentUser()
    if (storedUser) {
      setUser(storedUser)
      console.log('user from local storage', storedUser)
      processService.setToken(storedUser.token)
      recordService.setToken(storedUser.token)
    }
  }, [])

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const initialProcesses = await processService.getAll()
        setProcesses(initialProcesses)
      } catch (error) {
        setErrorMessage('error loading processes', error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }

    fetchProcesses()
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const authenticatedUser = await loginService.login({ username, password })
      savePersistentUser(authenticatedUser)
      processService.setToken(authenticatedUser.token)
      recordService.setToken(authenticatedUser.token)
      setUser(authenticatedUser)
    } catch (error) {
      setErrorMessage('wrong credentials', error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    removePersistentUser()
    setUser(null)
    window.location.reload()
  }

  const addProcess = async (processObject) => {
    const createdProcess = await processService.create(processObject)

    setProcesses(processes.concat(createdProcess))

    return createdProcess
  }

  const addRecord = async (recordObject) => {
    console.log('addRecord recordObject', recordObject)
    const createdRecord = await recordService.create(recordObject)

    setRecords(records.concat(createdRecord))

    return createdRecord
  }

  const updateRecord = async (processId, recordId, recordObject) => {
    console.log('processId', processId)
    console.log('recordId', recordId)
    console.log('updateRecord recordObject', recordObject)
    const updatedRecord = await recordService.update(
      processId,
      recordId,
      recordObject,
    )
    console.log('updateRecord returns', updatedRecord)

    setRecords((previousRecords) =>
      previousRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record,
      ),
    )

    return updatedRecord
  }

  const deleteProcess = (id) => {
    processService.remove(id).then(() => {
      setProcesses(processes.filter((n) => n.id !== id))
    })
  }

  const padding = {
    padding: 5,
  }

  const match = useMatch('/processes/:id/*')

  console.log('match', match)

  const process = match
    ? processes.find((process) => process.id === match.params.id)
    : null

  console.log('current process', process)

  useEffect(() => {
    if (process) {
      console.log('loading records..')
      recordService.getAll(process.id).then((initialRecords) => {
        setRecords(initialRecords)
        console.log('records loaded', initialRecords)
      })
    }
  }, [process])

  if (!user) {
    return (
      <div>
        <h1>BPM App</h1>
        <Notification message={errorMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/processes">
          processes
        </Link>
        <Link style={padding} to="/create">
          new process
        </Link>

        {user && <button onClick={handleLogout}>logout</button>}
      </div>

      <Notification message={errorMessage} />

      <Routes>
        <Route
          path="/processes/:id"
          element={
            <Process
              process={process}
              deleteProcess={deleteProcess}
              records={records}
              addRecord={addRecord}
              updateRecord={updateRecord}
            />
          }
        />
        <Route
          path="/processes/:id/records"
          element={<ProcessRecords addRecord={addRecord} process={process} />}
        />
        <Route
          path="/processes"
          element={<ProcessList processes={processes} />}
        />
        <Route
          path="/create"
          element={<ProcessForm createProcess={addProcess} />}
        />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
