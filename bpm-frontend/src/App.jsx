import { useState, useEffect } from 'react'
import processService from './services/processes'
import recordService from './services/records'
import loginService from './services/login'
import {
  getPersistentUser,
  savePersistentUser,
  removePersistentUser,
} from './services/persistentUser'

import { useNavigate, Routes, Route, useMatch } from 'react-router-dom'

import { Box, Container, CssBaseline } from '@mui/material'

import ProcessList from './components/ProcessList'
import Home from './components/Home'
import ProcessForm from './components/ProcessForm'
import Process from './components/Process'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import TopAppBar from './components/TopAppBar'
import KanbanBoard from './components/KanbanBoard'
import AddRecordDrawer from './components/AddRecordDrawer'
import TopBreadcrumb from './components/TopBreadcrumb'
import EditProcess from './components/EditProcess'

const App = () => {
  const [processes, setProcesses] = useState([])
  const [records, setRecords] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  const [isAddingNewRecord, setIsAddingNewRecord] = useState(null)
  const handleCloseNew = () => setIsAddingNewRecord(null)
  const handleAddNew = () => setIsAddingNewRecord(true)

  const navigate = useNavigate()

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
      navigate('/')
    } catch (error) {
      setNotificationMessage({
        message: `wrong credentials`,
        type: 'error',
      })
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
    try {
      const createdProcess = await processService.create(processObject)

      setProcesses(processes.concat(createdProcess))

      setNotificationMessage({ message: 'created process', type: 'info' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

      return createdProcess
    } catch (error) {
      const msg = error.response?.data?.error || 'error'
      setNotificationMessage({ message: msg, type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return null
    }
  }

  const updateProcess = async (processId, processObject) => {
    try {
      const updatedProcess = await processService.update(
        processId,
        processObject,
      )

      setProcesses((previousProcesses) =>
        previousProcesses.map((process) =>
          process.id === updatedProcess.id ? updatedProcess : process,
        ),
      )
      setNotificationMessage({ message: 'updated process', type: 'info' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return updatedProcess
    } catch (error) {
      const msg = error.response?.data?.error || 'error'
      setNotificationMessage({ message: msg, type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return null
    }
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
        record.id === updatedRecord.id ? { ...updatedRecord } : record,
      ),
    )

    return updatedRecord
  }

  const deleteRecord = async (processId, recordId) => {
    await recordService.remove(processId, recordId)
    setRecords(records.filter((r) => r.id !== recordId))
  }

  const deleteProcess = (processId) => {
    processService.remove(processId).then(() => {
      setProcesses(processes.filter((p) => p.id !== processId))
    })
  }

  const match = useMatch('/processes/:id/*')

  const process = match
    ? processes.find((process) => process.id === match.params.id)
    : null

  useEffect(() => {
    if (process) {
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
        <Notification notification={notificationMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8f8f8',
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <TopAppBar
          user={user}
          handleLogout={handleLogout}
          handleAddNew={handleAddNew}
          processId={process?.id}
        />
        <TopBreadcrumb process={process} />

        <Notification notification={notificationMessage} />

        <Container
          maxWidth="xl"
          sx={{
            mt: 2,
            mb: 4,
            flexGrow: 1,
          }}
        >
          <Routes>
            <Route
              path="/processes/:id"
              element={
                <Process process={process} deleteProcess={deleteProcess} />
              }
            />
            <Route
              path="/processes/:id/records/kanban"
              element={
                <KanbanBoard
                  key={process?._id || process?.id}
                  process={process}
                  deleteRecord={deleteRecord}
                  addRecord={addRecord}
                  updateRecord={updateRecord}
                  records={records}
                />
              }
            />
            <Route
              path="/processes/:id/edit"
              element={
                <EditProcess
                  updateProcess={updateProcess}
                  setNotificationMessage={setNotificationMessage}
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
