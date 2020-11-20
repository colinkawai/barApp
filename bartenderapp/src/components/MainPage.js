import React, { Component } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import Card from "./Card";
import AllFacets from "./AllFacets";
import TopMenu from "./TopMenu";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../styles/MainPage.css";
import PersonalDrinks from "./PersonalDrinks";
axios.defaults.withCredentials = true;
class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      cocktails: [],
      topMenu: false,
      infoMenu: false,
      facetChoice: ["none", "personal", "most", "least"], 
      ingredientsPersonal: 0,
      ingredientsTotal: 0,
      liquorsTotal: 0,
      liquorsPersonal: 0,
    };
  }
  async componentDidMount() {
    await this.updateDrinksState();
    this.updateDrinkIngredCount();
  }

  //For the count on the nav bar
  updateDrinkIngredCount = async () => {
    let ingredientsArray = JSON.parse(localStorage.getItem("ingredients"));
    let liquorsArray = JSON.parse(localStorage.getItem("liquors"));

    this.setState({ ingredientsPersonal: ingredientsArray.length });
    this.setState({ liquorsPersonal: liquorsArray.length });

    let allLiquorsCallString = "http://localhost:3000/justIngredients";
    let allIngredCallString =
      "http://localhost:3000/justIngredients/type/liquor";

    const reqOne = await axios.get(allLiquorsCallString);
    const reqTwo = await axios.get(allIngredCallString);
    axios
      .all([reqOne, reqTwo])
      .then(
        axios.spread((...res) => {
          const resOne = res[0];
          const resTwo = res[1];

          this.setState({ ingredientsTotal: resOne.data.length });
          this.setState({ liquorsTotal: resTwo.data.length });
        })
      )
      .catch((errs) => {
        console.log(errs);
      });
  };

  updateDrinksState = async () => {
    // if there is nothing inside local storage
    let callString = "http://localhost:3000/drinks/filter/ingredient/?";
    let ingredientsArray = JSON.parse(localStorage.getItem("ingredients"));
    let liquorsArray = JSON.parse(localStorage.getItem("liquors"));

    if (ingredientsArray === null) {
      localStorage.setItem("ingredients", JSON.stringify([]));
      ingredientsArray = JSON.parse(localStorage.getItem("ingredients"));
    }
    if (liquorsArray === null) {
      localStorage.setItem("liquors", JSON.stringify([]));
      liquorsArray = JSON.parse(localStorage.getItem("liquors"));
    }
    for (let i = 0; i < liquorsArray.length; i++) {
      callString = callString + "array[]=" + liquorsArray[i] + "&";
    }
    for (let i = 0; i < ingredientsArray.length; i++) {
      callString = callString + "array[]=" + ingredientsArray[i] + "&";
    }
    if (ingredientsArray.length === 0 && liquorsArray.length === 0) {
      callString = "http://localhost:3000/drinks/";
    }
    console.log(callString);

    axios
      .get(callString)
      .then((res) => {
        console.log(res.data);
        this.setState({ cocktails: res.data.Items });
      })
      .catch((err) => {
        console.log(err);
      });

    //this.updateDrinkIngredCount();
  };
  toggleTopMenu = () => {
    this.setState({ topMenu: this.state.topMenu ? false : true });
  };
  toggleInfoMenu = () => {
    this.setState({ infoMenu: this.state.infoMenu ? false : true });
  };

  facetClick = (facet) => {
    this.setState({facetChoice: facet});
  }

  createCards = () => {
    let drinks = [];
    for (let i = 0; i < this.state.cocktails.length; i++) {
      drinks.push(<Card cocktails={this.state.cocktails[i]} />);
    }

    return drinks;
  };

  render() {
    return (
      <div className="mainContainer">
        <NavBar
          toggleTopMenu={this.toggleTopMenu}
          toggleInfoMenu={this.toggleInfoMenu}
          ingredientsPersonal={this.state.ingredientsPersonal}
          ingredientsTotal={this.state.ingredientsTotal}
          liquorsTotal={this.state.liquorsTotal}
          liquorsPersonal={this.state.liquorsPersonal}
        />

        <TopMenu
          modal={this.state.topMenu}
          toggleTopMenu={this.toggleTopMenu}
          updateDrinksState={this.updateDrinksState}
          updateDrinkIngredCount={this.updateDrinkIngredCount}
        />

        <AllFacets facetClick = {} />
        <div className="drinksResultsContainer">{this.createCards()}</div>
      </div>
    );
  }
}
export default MainPage;
