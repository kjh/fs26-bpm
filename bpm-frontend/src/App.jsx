import { useState, useEffect } from 'react'
import processService from './services/processes'

import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'

import ProcessList from './components/ProcessList'
import Home from './components/Home'
import Footer from './components/Footer'
import ProcessForm from './components/ProcessForm'
import Process from './components/Process'

const App = () => {
  const [processes, setProcesses] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBPMUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      processService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    processService.getAll().then(initialProcesses => {
      setProcesses(initialProcesses)
    })
  }, [])
 
  const addProcess = async processObject => {
    const createdProcess = await processService.create(processObject)

    setProcesses(processes.concat(createdProcess))
    
    return createdProcess
  }

  const deleteProcess = (id) => {
    processService.remove(id).then(() => {
      setProcesses(processes.filter(n => n.id !== id))
    })
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/processes/:id')

  const process = match
    ? processes.find(process => process.id === match.params.id)
    : null

  console.log(process)

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/processes">processes</Link>
        <Link style={padding} to="/create">new process</Link>
      </div>

      <Routes>
        <Route path="/processes/:id" element={
          <Process
            process={process}
            deleteProcess={deleteProcess}
          />
        } />
        <Route path="/processes" element={
          <ProcessList processes={processes} />
        } />
        <Route path="/create" element={
          <ProcessForm createProcess={addProcess}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App