import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Notification from './Notification'
import LoginForm from './LoginForm'
import loginService from '../services/login'
import processService from '../services/processes'

const ProcessList = ({ processes }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBPMUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      processService.setToken(user.token)
    }
  }, [])



  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBPMUser', JSON.stringify(user))
      processService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  return (
    <div>
      <h1>Processes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}

      <ul>
        {processes.map(process => (
          <li key={process.id}>
            <Link to={`/processes/${process.id}`}>{process.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProcessList