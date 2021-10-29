import React, { useState } from 'react'

import PersonForm from './components/PersonForm.js'
import Persons from './components/Persons.js'
import Filter from './components/Filter.js'

const App = () => {
  const [ persons, setPersons ] = useState([
    { 
      name: 'Arto Hellas', 
      id: 0
    }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()    //to stop the page from reloading among other things

    const phonebookObject = {
      name: newName,
      number: newNumber,
      id: persons.length
    }

    if(persons.find(person => person.name===newName))
      window.alert(`${newName} is already added to phonebook`)
    else
      setPersons(persons.concat(phonebookObject))

    setNewName('')
    setNewNumber('')
    }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <br/>

      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
      
    </div>
  )
}

export default App