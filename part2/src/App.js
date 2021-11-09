import React, { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm.js'
import Persons from './components/Persons.js'
import Filter from './components/Filter.js'
import phonebookService from './services/phonebook'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter] = useState('')

  useEffect (() => {  //ran after component is rendered
    phonebookService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter filter={filter} setFilter={setFilter}/>
      <br/>

      <PersonForm newName={newName} newNumber={newNumber} persons={persons} setNewName={setNewName} setNewNumber={setNewNumber} setPersons={setPersons}/>

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
      
    </div>
  )
}

export default App