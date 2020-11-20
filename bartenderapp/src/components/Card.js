import React, { Component } from "react";
import DrinkDetail from "./DrinkDetail";
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientsTotalDrinkCount: 0,
      ingredientsTotalDrinkName: [],
      ingredientsMatchingCount: 0,
      ingredientsMatchingName: [],
      cardDetailShow: false,
      hover: false,
    };
  }
  mouseOver = () => {
    this.setState({ hover: true });
  };
  mouseOut = () => {
    this.setState({ hover: false });
  };
  cardBlur = () => {
    this.setState({ hover: false });
  };
  toggleCardDetail = () => {
    this.setState({ cardDetailShow: this.state.cardDetailShow ? false : true });
  };
  //render everything on render
  async componentDidMount() {
    let ingredientsTotalDrinkName = await this.countIngredientsTotal();
    this.countMatchingIngredients(ingredientsTotalDrinkName);
  }
  async componentDidUpdate(prevProps) {
    if (this.props.cocktails !== prevProps.cocktails) {
      let ingredientsTotalDrinkName = await this.countIngredientsTotal();
      this.countMatchingIngredients(ingredientsTotalDrinkName);
    }
  }

  //used 14 because there are only 15 ingredients
  //count ingredients in the drink
  countIngredientsTotal = async () => {
    let array = [];
    for (let i = 1; i <= 15; i++) {
      let numberString = i.toString();
      let ingredient = "strIngredient" + numberString;
      if (this.props.cocktails[ingredient] === null) {
        break;
      }
      array.push(this.props.cocktails[ingredient]);
    }
    this.setState({ ingredientsTotalDrinkCount: array.length });
    this.setState({ ingredientsTotalDrinkName: array });
    return array; // can't use the state right after becuase setStates are batched
  };

  countMatchingIngredients = async (param) => {
    let ingredientsArray = JSON.parse(localStorage.getItem("ingredients"));
    let ingredientsTotalDrinkName = param;
    let liquorsArray = JSON.parse(localStorage.getItem("liquors"));
    let allIngredientsArray = ingredientsArray.concat(liquorsArray);

    let matchingName = [];
    // if drink contains the ingredient we have, push that to ingredientsMatchingArray
    for (let i = 0; i < allIngredientsArray.length; i++) {
      if (ingredientsTotalDrinkName.includes(allIngredientsArray[i]) === true) {
        matchingName.push(allIngredientsArray[i]);
      }
    }
    this.setState({ ingredientsMatchingCount: matchingName.length });
    this.setState({ ingredientsMatchingName: matchingName });
  };
  renderIngredientAmount = () => {
    let returnArray = [];

    let ingredientsTotal = this.state.ingredientsTotalDrinkCount;
    let matchingTotal = this.state.ingredientsMatchingCount;

    let renderString = (
      <div>
        {matchingTotal} / {ingredientsTotal}
      </div>
    );
    returnArray.push(renderString);
    return returnArray;
  };

  render() {
    return (
      <div
        onClick={this.toggleCardDetail}
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
        onBlur={this.cardBlur}
        className={"drinks " + (this.state.hover ? "drinkHover" : "")}
      >
        {this.state.cardDetailShow ? (
          <DrinkDetail
            modal={this.state.cardDetailShow}
            drinkID={this.props.cocktails.id}
            toggleCardDetail={this.toggleCardDetail}
            matchingName={this.state.ingredientsMatchingName}
          />
        ) : (
          <div></div>
        )}

        <img
          src={this.props.cocktails.strDrinkThumb}
          className="drinkPhoto"
        ></img>
        <div className="drinkTitle">{this.props.cocktails.strDrink}</div>
        <div className="ingredients">{this.renderIngredientAmount()}</div>
      </div>
    );
  }
}
export default Card;
