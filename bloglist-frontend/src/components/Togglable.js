import React, { useState, useImperativeHandle } from 'react'

//'React.forwardRef' passes on the ref to children of the componenet
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(true)

  //display:'none' makes that part invisible
  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  //ref is being used here bcz of React.forwardRef
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  if(props.buttonLable === null) {
    props.buttonLable = 'expand'
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLable}</button>
      </div>
      <div style={showWhenVisible}>
        {/* children attribute is added automatically. child components are React elements that we define between the opening and closing tags of a component  */}
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable