import React, { Component } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Switch,
  withRouter,
  Route,
  Link,
} from "react-router-dom";
import MainPage from "./components/MainPage";
import PersonalDrinks from "./components/PersonalDrinks";
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={withRouter(MainPage)} />
        <Route path="/personal" component={withRouter(PersonalDrinks)} />
      </Switch>
    );
  }
}
export default App;
