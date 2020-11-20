import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DrinkDetail.css";
import { array } from "prop-types";
axios.defaults.withCredentials = true;
const DrinkDetail = (props) => {
  //const { buttonLabel, className } = props;
  const [ingredient, setIngredient] = useState([]);
  const [ingredientsAmount, setIngredientsAmount] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [drinkName, setDrinkName] = useState("");

  const [nameRender, setNameRender] = useState([]);
  const [ingredientsRender, setIngredientsRender] = useState([]);
  const [amountRender, setAmountRender] = useState([]);
  const [instructionsRender, setInstructionsRender] = useState([]);

  useEffect(() => {
    let callString = "http://localhost:3000/drinks/" + props.drinkID;
    axios
      .get(callString)
      .then(function (res) {
        console.log(res.data[0]);
        iterateIngredients(res.data[0]);
        iterateIngredientsAmount(res.data[0]);
        iterateInstructions(res.data[0]);
        setName(res.data[0]);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);
  const setName = (drinkData) => {
    let returnArray = [];
    setDrinkName(drinkData.strDrink);
    returnArray.push(<div>{drinkData.strDrink}</div>);
    setNameRender(returnArray);
  };
  const iterateIngredients = (drinkData) => {
    let string = "strIngredient";
    let array = [];
    let returnArray = [];
    let matchingNameArray = props.matchingName;

    for (let i = 1; i <= 15; i++) {
      let numberString = i.toString();
      let ingredient = string + numberString;
      if (drinkData[ingredient] === null) {
        break;
      }
      array.push(drinkData[ingredient]);
      if (matchingNameArray.includes(drinkData[ingredient]) === true) {
        returnArray.push(
          <li className="hasIngredient">{drinkData[ingredient]}</li>
        );
      } else {
        returnArray.push(<li>{drinkData[ingredient]}</li>);
      }
    }
    setIngredient(array);
    setIngredientsRender(returnArray);
  };
  const iterateIngredientsAmount = (drinkData) => {
    let string = "strMeasure";
    let array = [];
    let returnArray = [];
    for (let i = 1; i <= 15; i++) {
      let numberString = i.toString();
      let measure = string + numberString;
      if (drinkData[measure] === null) {
        break;
      }
      array.push(drinkData[measure]);
      returnArray.push(<li>{drinkData[measure]}</li>);
    }
    setIngredientsAmount(array);
    setAmountRender(returnArray);
  };

  const iterateInstructions = (drinkData) => {
    let returnArray = [];
    returnArray.push(<div>{drinkData.strInstructions}</div>);
    setInstructionsRender(returnArray);
    setInstructions(drinkData.strInstructions);
  };

  const addDrink = async () => {
    let getString = "http://localhost:3000/userDrinks/" + props.drinkID;
    let result = await axios.get(getString);
    console.log(result);
    if (result.data.length === 0) {
      let postString = "http://localhost:3000/userDrinks/" + props.drinkID;
      axios
        .post(postString)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="drinkDetail">
      <Modal
        id="modalDialog"
        isOpen={props.modal}
        fade={false}
        toggle={props.toggleCardDetail}
      >
        <ModalHeader id="modalHead" toggle={props.toggleCardDetail}>
          {nameRender}
        </ModalHeader>
        <ModalBody id="modalBody">
          <div className="ingredientsAndAmount">
            <ol id="ingredients">{ingredientsRender}</ol>
            <ul id="amount">{amountRender}</ul>
          </div>
          {instructionsRender}
        </ModalBody>
        <ModalFooter id="modalFooter">
          <Button
            color="primary"
            onClick={() => {
              props.toggleCardDetail();
              addDrink();
            }}
          >
            Add Drink
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DrinkDetail;
