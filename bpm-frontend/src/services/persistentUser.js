export const getPersistentUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBPMUser')
  if (loggedUserJSON) {
    return JSON.parse(loggedUserJSON)
  }
  return null
}

export const savePersistentUser = (user) => {
  window.localStorage.setItem('loggedBPMUser', JSON.stringify(user))
}

export const removePersistentUser = () => {
  window.localStorage.removeItem('loggedBPMUser')
}
