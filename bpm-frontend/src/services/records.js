import axios from 'axios'
const baseUrl = '/api/processes'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async (processId) => {
  const response = await axios.get(`${baseUrl}/${processId}/records`)
  return response.data
}

const create = async (newRecordObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${newRecordObject.process_id}/records`,
    newRecordObject,
    config,
  )
  return response.data
}

const update = async (processId, recordId, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(
    'records service update record',
    `${baseUrl}/${processId}/records/${recordId}`,
  )
  const response = await axios.put(
    `${baseUrl}/${processId}/records/${recordId}`,
    updatedObject,
    config,
  )
  console.log('records service update record READY')
  return response.data
}

const remove = async (processId, recordId) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(
    `${baseUrl}/${processId}/records/${recordId}`,
    config,
  )
  return response.data
}

export default { getAll, create, update, remove, setToken }
