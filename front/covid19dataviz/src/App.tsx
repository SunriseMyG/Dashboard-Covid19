import React from 'react';
import './App.css';
import logo from './assets/Johns-Hopkins-University-Symbol.png'
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className='App-logo' alt='logo' />
        <h1>
          COVID-19 Dashboard
        </h1>
        <p className='header-paragraph'>
          by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University (JHU)
        </p>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
