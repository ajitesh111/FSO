import React from 'react'

const Person = (props) => <p>{props.person.name} {props.person.number}</p>

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
        const newPersons = persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase()))
  
        return(
          <div>
            {newPersons.map(person =>
              <Person key={person.id} person={person}/>)}
          </div>
      )
    }
  }

export default Persons