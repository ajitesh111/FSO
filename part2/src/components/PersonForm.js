import React from 'react'

import phonebookService from 'A:/CODE/FullStackOpen/part2/src/services/phonebook'

const PersonForm = (props) => {
  const addName = (event) => {
    event.preventDefault()    //to stop the page from reloading among other things

    const phonebookObject = {
      name: props.newName,
      number: props.newNumber,
      id: props.persons[props.persons.length-1].id+1
    }

    const matchedObject = props.persons.find(person => person.name===props.newName)

    if(matchedObject)
    {
      if(window.confirm(`${props.newName} is already added to phonebook, would you like to replace with new number?`))
      {
        const updatedPhonebookObject =  {
          ...phonebookObject,
          id: matchedObject.id,
          number: props.newNumber
        }

        phonebookService
          .replace(updatedPhonebookObject)
          .then(response => {
            props.setPersons(props.persons.map(person => person.id !== updatedPhonebookObject.id ? person : response.data))
          })
          .catch(error => {
            props.setErrorMessage(error.response.data)
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)

            props.setPersons(props.persons)
          })
      }
    } else {
      phonebookService
        .create(phonebookObject)
        .then(response => {
          // console.log(response)
          props.setPersons(props.persons.concat (response.data)) //concat creates an object copy with changes
          props.setSuccessMessage(
            `Added ${props.newName} to the phonebook`
          )
          setTimeout(() => {
            props.setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          props.setErrorMessage(error.response.data)
          setTimeout(() => {
            props.setErrorMessage(null)
          }, 5000)
        })
    }

    props.setNewNumber('')
    props.setNewName('')
  }

  const handleNameChange = (event) => {
    props.setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    props.setNewNumber(event.target.value)
  }

  return(
    <form onSubmit={addName}>
      <div>
        name: <input 
                value={props.newName} 
                onChange={handleNameChange}
              />
      </div>
      <div>
        number: <input 
                value={props.newNumber} 
                onChange={handleNumberChange}
              />
      </div>
      <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm