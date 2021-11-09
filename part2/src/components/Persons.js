import React from 'react'

import phonebookService from 'A:/CODE/FullStackOpen/part2/src/services/phonebook'

const deleteNumber = (person) => {
  const handler = () => {
    if(window.confirm(`Delete ${person.name}?`))
      phonebookService.remove(person.id)
  }
  return handler
}

const Person = (props) => {
  return(
    <span>
      <p>{props.person.name} {props.person.number}</p>
      <button onClick={deleteNumber(props.person)}>delete</button>
    </span>
  )
}
const Persons = ({persons, filter}) => {
    if(filter === '')
    {
      return(
        <div>
          {persons.map(person => 
            <Person key={person.id} person={person} />
          )}
        </div>
    )} else {
        const newPersons = persons.filter(person => person.name.startsWith(filter.toLowerCase()))
  
        return(
          <div>
            {newPersons.map(person =>
              <Person key={person.id} person={person}/>
            )}
          </div>
        )
    }
  }

export default Persons