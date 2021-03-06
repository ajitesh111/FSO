import React, { useState } from 'react'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    login({ username, password })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>login to the application</h2>
      <form onSubmit={handleLogin}>
        <div>
          {/* '&emsp;' puts a tab space */}
                username &emsp;
          <input id='username' type='text' value={username} name='username' onChange={handleUsernameChange}/>
        </div>
        <div>
                password &emsp;
          <input id='password' type='password' value={password} name='password' onChange={handlePasswordChange}/>
        </div>
        <button id='loginButton' type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm