import axios from 'axios'

const url = '/api/persons'

const getAll = () => {
    return axios.get(url)
}

const create = (phonebookObject) => {
    return axios.post(url, phonebookObject)
}

const remove = (personId) => {
    return axios.delete(url+`/${personId}`)
}

const replace = (updatedPhonebookObject) => {
    return axios.put(url+`/${updatedPhonebookObject.id}`, updatedPhonebookObject)
}

export default {getAll, create, remove, replace}