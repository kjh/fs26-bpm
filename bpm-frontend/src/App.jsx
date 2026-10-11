import { useState, useEffect } from 'react'
import processService from './services/processes'
import recordService from './services/records'
import loginService from './services/login'
import {
  getPersistentUser,
  savePersistentUser,
  removePersistentUser,
} from './services/persistentUser'

import { Routes, Route, useMatch } from 'react-router-dom'

import { Box, Container, CssBaseline } from '@mui/material'

import ProcessList from './components/ProcessList'
import ProcessRecords from './components/ProcessRecords'
import Home from './components/Home'
import ProcessForm from './components/ProcessForm'
import Process from './components/Process'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import TopAppBar from './components/TopAppBar'
import KanbanBoard from './components/KanbanBoard'
import AddRecordDrawer from './components/AddRecordDrawer'
import TopBreadcrumb from './components/TopBreadcrumb'

const App = () => {
  const [processes, setProcesses] = useState([])
  const [records, setRecords] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  const [isAddingNewRecord, setIsAddingNewRecord] = useState(null)
  const handleCloseNew = () => setIsAddingNewRecord(null)
  const handleAddNew = () => setIsAddingNewRecord(true)

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
        setNotificationMessage({ message: 'loaded processes', type: 'info' })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      } catch (error) {
        setNotificationMessage({
          message: 'error loading processes',
          type: 'error',
        })
        setTimeout(() => {
          setNotificationMessage(null)
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
      setNotificationMessage({
        message: `Welcome ${authenticatedUser.name}`,
        type: 'info',
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationMessage({ message: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
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
    const updatedRecord = await recordService.update(
      processId,
      recordId,
      recordObject,
    )

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

  const match = useMatch('/processes/:id/*')

  const process = match
    ? processes.find((process) => process.id === match.params.id)
    : null

  console.log('APP current process', process)

  useEffect(() => {
    console.log('process changed..')
    if (process) {
      console.log('loading records...')
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
        <Notification message={notificationMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }
  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f8f8f8' }}>
        <TopAppBar
          user={user}
          handleLogout={handleLogout}
          handleAddNew={handleAddNew}
          processId={process?.id}
        />
        <TopBreadcrumb process={process} />

        <Notification notification={notificationMessage} />

        <Container maxWidth="xl" sx={{ mt: 1 }}>
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
              element={
                <ProcessRecords
                  process={process}
                  deleteProcess={deleteProcess}
                  records={records}
                  addRecord={addRecord}
                  updateRecord={updateRecord}
                />
              }
            />
            <Route
              path="/processes/:id/records/kanban"
              element={
                <KanbanBoard
                  process={process}
                  deleteProcess={deleteProcess}
                  addRecord={addRecord}
                  updateRecord={updateRecord}
                  records={records}
                />
              }
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

          <AddRecordDrawer
            process={process}
            addRecord={addRecord}
            isAddingNewRecord={isAddingNewRecord}
            handleCloseNew={handleCloseNew}
          />
        </Container>
      </Box>
    </>
  )
}

export default App
