import React, { useState } from 'react'

const anecdoteGenerator = (len, setSelected) => {   //len = props
  let randNum =  Math.floor(Math.random()*len)

  setSelected(randNum)
}

const vote = (votes, selected, setVotes) => {
  const newVotes = [...votes]
  newVotes[selected] += 1

  setVotes(newVotes)
}

const MostVotes = ({votes, anecdotes}) => {
  const maxVotes = {count:0, index:0}

  for(let i=0; i<votes.length; i++)
  {
    if(votes[i] > maxVotes.count)
    {
      maxVotes.count = votes[i]
      maxVotes.index = i
    }
  }

  return(
    <div>
      Anecdote with most votes
      <br/>
      {anecdotes[maxVotes.index]}
      <br/>
      has {maxVotes.count} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  // const ary = new Array(anecdotes.length).fill(0)

  return (
    <div>
      {anecdotes[selected]}
      <br/>

      has {votes[selected]} votes
      <br/>

      <button onClick={() => {anecdoteGenerator(anecdotes.length, setSelected)}}>next Anecdotes</button>

      <button onClick={() => {vote(votes, selected, setVotes)}}>vote</button>
      <br/><br/>

      <MostVotes votes={votes} anecdotes={anecdotes}/>
      {/* Anecdote with most votes
      <br/>
      {anecdotes[maxVotes.index]}
      <br/>
      has {maxVotes.count} votes*/}
      </div> 
  )
}

export default App