import React from 'react'

const Parts = ({part}) => {
    return(
      <p>
        {part.name} {part.exercises}
      </p>
    )
  }
  
  const Content = ({parts}) => {
    const total = parts.reduce((sum, part) => sum+part.exercises, 0)
  
    return(
      <div>
        {parts.map(part => 
          <Parts key={part.id} part={part}/>
        )}
  
        <b>Total of {total} exercises</b>
      </div>
    )
  }
  
  const Header = ({name}) => <h2>{name}</h2>
  
  const Course = ({courses}) => {
    return(
      <div>
        {courses.map(course => {
          return(
            <div key={course.id}>
              <Header name={course.name}/>
  
              <Content parts={course.parts}/>
            </div>
            )
          })
        }
      </div>
    )
  }

  export default Course