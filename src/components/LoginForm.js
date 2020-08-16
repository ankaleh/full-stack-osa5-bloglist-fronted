import React from 'react'

const LoginForm = (props) => (
  <div>
    <h2>Kirjaudu sisään alla olevalla lomakkeella</h2>

    <form onSubmit={props.handleLogin}>
      <div>Käyttäjätunnus</div>
      <input type="text" value={props.kayttajatunnus} name="Username"
        onChange={({ target }) => props.setKayttajatunnus(target.value)}
      />
      <div>Salasana</div>
      <input type="text" value={props.salasanaHash} name="Password"
        onChange={({ target }) => props.setSalasanaHash(target.value)}
      />
      <button type="submit" id='kirjaudu'>Kirjaudu</button>
    </form>

  </div>

)

export default LoginForm