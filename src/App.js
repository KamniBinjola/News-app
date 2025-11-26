import './App.css';
import React, { Component } from 'react'
import Navbar from './components/Navbar';
import News from './components/News';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";export default class App extends Component {
  render() {
    return (
      <div>
        <Router basename="/News-app">

          <Navbar />

          <Switch>
            <Route exact path="/">
              <News pageSize={6} country="us" category="general" />
            </Route>

            <Route path="/business">
              <News pageSize={6} country="us" category="business" />
            </Route>

            <Route path="/entertainment">
              <News pageSize={6} country="us" category="entertainment" />
            </Route>

            <Route path="/general">
              <News pageSize={6} country="us" category="general" />
            </Route>

            <Route path="/health">
              <News pageSize={6} country="us" category="health" />
            </Route>

            <Route path="/science">
              <News pageSize={6} country="us" category="science" />
            </Route>

            <Route path="/sports">
              <News pageSize={6} country="us" category="sports" />
            </Route>

            <Route path="/technology">
              <News pageSize={6} country="us" category="technology" />
            </Route>

          </Switch>

        </Router>
      </div>
    )
  }
}



