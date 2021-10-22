import React, { useState } from 'react'

const Header = (props) => <div><h1>{props.head}</h1></div>

const Button = (props) => {
  return(
    <span>
      <button onClick={() => props.setter(props.stat+1)}>{props.text}</button>
    </span>
  )
}

const StatisticLine = (props) => {
  return(
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Stats = ({good, neutral, bad}) => {   //{good,netural,bad} = props

  if(good===0 && neutral===0 && bad===0)
  {
    return(
      <div>
        <b>No feedback gathered</b>
      </div>
    )
  } else {
    return(
      <div>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={good+neutral+bad}  />
        <StatisticLine text="average" value={(good-bad)/  (good+neutral+bad)}/>
        <StatisticLine text="positive" value={good/(good  +neutral+bad) * 100}/>
      </div>
    )
  }
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header head="give feedback" />

      <Button stat={good} setter={setGood} text="good"/>
      <Button stat={neutral} setter={setNeutral} text="neutral"/>
      <Button stat={bad} setter={setBad} text="bad"/>

      <Header head="Stats" />

      <Stats good={good} bad={bad} neutral={neutral}/>

    </div>
  )
}

export default App