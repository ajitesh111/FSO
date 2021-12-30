import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null  //private variable

//accessor for private var
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  // const request = axios.get(baseUrl)
  // return request.then(response => response.data)

  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBloglistItem => {
  //blogs.post expects authorization header
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.post(baseUrl, newBloglistItem, config)
  return response.data
}

export default { getAll, create, setToken }