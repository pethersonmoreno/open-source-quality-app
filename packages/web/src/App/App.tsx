import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeComparationPage from '../pages/HomeComparationPage';
import Header from './components/Header';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-content">
          <div className="__content">
            <Switch>
              <Route path="/">
                <HomeComparationPage />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
