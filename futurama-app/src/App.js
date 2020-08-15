import React, { useState , useEffect} from 'react';
import './App.css';
import Fuse from 'fuse.js';
import axios from "axios";
import characters from './characters.json';


function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // logout the user
  const handleLogout = () => {
    setUser();
    setUsername("");
    setPassword("");
    localStorage.clear();
  };
  const [query, updateQuery] = useState('');

  const fuse = new Fuse(characters, {
      keys: ['name','company','species'],
      includeScore: true
  });
  
    
    const results = fuse.search(query);
    const characterResults = query ? results.map(character => character.item) : characters;

    function onSearch({ currentTarget }) {
    updateQuery(currentTarget.value);
  }

    const handleSubmit = async e => {
    e.preventDefault();
    const user = { username, password };
    // send the username and password to the server
    const response = await axios.post(
      //"http://localhost:8080/api/auth/signin",
      "https://blogservice.herokuapp.com/api/login",
      user
    );
    console.log(response)
    // set the state of the user
    setUser(response.data);
    // store the user in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));
  };

  if (user){
        return (
      <>

        <header className="App-header">
          <div className="container">
            <h1>Futurama Characters</h1>
          </div>
          <nav className="navbar navbar-light bg-light">
          <button className="btn btn-warning" onClick={handleLogout}>logout</button>
        <form className="form-inline search">
         <label>Search</label>
              <input type="text" value={query} onChange={onSearch}/>
        </form>
      </nav>     
        </header>

        <main className="container">
                

          <ul className="characters">
            {characterResults.map(character => {
              const { name, company, species, thumb } = character;
              return (
                <li key={name} className="character">
                  <span className="character-thumb" style={{
                    backgroundImage: `url(${thumb})`
                  }} />
                  <ul className="character-meta">
                    <li>
                      <strong>Name:</strong> { name }
                    </li>
                    <li>
                      <strong>Company:</strong> { company }
                    </li>
                    <li>
                      <strong>Species:</strong> { species }
                    </li>
                  </ul>
                </li>
              )
            })}
          </ul>
        </main>
      </>
    );
  }

      // if there's no user, show the login form
  return (
    <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Iniciar Sesion</h5>
                <form className="form-signin" onSubmit={handleSubmit}>
                  <div className="form-label-group">
                    <label htmlFor="inputUsername">Username</label>
                    <input type="text" id="inputUsername"
                    value={username} 
                    className="form-control" 
                    placeholder="enter a username"
                    onChange={({ target }) => setUsername(target.value)}
                    required autoFocus/>
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" 
                    id="inputPassword" 
                    className="form-control" 
                    placeholder="enter a password" 
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    required />
                  </div>
                  <hr className="my-4" />
                  <button className="btn btn-success btn-block text-uppercase" 
              type="submit">Login</button>     
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
