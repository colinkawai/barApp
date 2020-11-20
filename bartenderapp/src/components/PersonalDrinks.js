import React, { Component } from "react";
import axios from "axios";

import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link,
} from "react-router-dom";
class PersonalDrinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drinks: [],
      drinkNames: [],
    };
  }
  componentDidMount() {
    this.getDrinks();
  }

  getDrinks = async () => {
    //get drinks IDs
    let res = await axios.get("http://localhost:3000/userDrinks/email");
    this.setState({ drinks: res.data[0].drinkID });
    //get drinks themselves
    // do batch call
    let drinksArray = this.state.drinks;
    let callString = "http://localhost:3000/drinks/arrayID/drink/?";
    for (let i = 0; i < drinksArray.length; i++) {
      callString = callString + "someArray[]=" + drinksArray[i] + "&";
    }
    let resOne = await axios.get(callString);
    console.log(resOne);

    //create array of
    /*
    for (let i = 0; i < drinksArray.length; i++) {
      let res = await axios.get(
        "http://localhost:3000/drinks/" + drinksArray[i]
      );
      setArray.push(<div>{res.data[0].strDrink}</div>);
    }
    this.setState({ drinkNames: setArray });
    */
  };
  /*
  getDivs = () => {
    let returnArray = [];
    let drinkNames = this.state.drinkNames;
    for (let i = 0; i < drinksNames.length; i++) {
      returnArray.push(drinkNames[i]);
    }
    return returnArray;
  };
*/
  render() {
    return <div className="mainPersonal">{this.state.drinkNames}</div>;
  }
}
export default PersonalDrinks;
