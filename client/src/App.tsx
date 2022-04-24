import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Room from './components/Room/Room';

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={Home} />
      <Route path="/room/:idRoom" component={Room} />
    </div>
  );
}

export default App;
