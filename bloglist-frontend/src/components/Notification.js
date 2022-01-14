/*eslint-disable*/ 

import React from 'react'

const Notification = (props) => {
    if(props.errorMessage){
      return(
        <div className='error'>
          {props.errorMessage}
        </div>
      )} else if(props.successMessage){
      return(
        <div className='success'>
          {props.successMessage}
        </div>
      )} else {
      return null
    }
  }

export default  Notification