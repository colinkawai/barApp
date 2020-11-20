import React, { useState, useEffect, useRef } from "react";
import "../styles/SearchCard.css";
import ButtonSelect from "./ButtonSelect";
import axios from "axios";
import { Button } from "reactstrap";
axios.defaults.withCredentials = true;
function useOutsideAlerter(ref, props) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("you clicked outside of me");

        props.toggleCard("", "", true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const SearchCard = (props) => {
  const searchWrapperRef = useRef(null);
  useOutsideAlerter(searchWrapperRef, props);
  const [array, setArray] = useState([]);
  const handleButtonClick = (param, type) => {
    // fetchData();
    //checks if the ingredient is already in local storage
    // if it is then it won't add the item to local stoage
    // local storage is sperated into ingredients and liquors
    //props.onMenuBlur();
    let liquorArray = JSON.parse(localStorage.getItem("liquors"));
    let ingredientArray = JSON.parse(localStorage.getItem("ingredients"));

    if (liquorArray === null) {
      localStorage.setItem("liquors", JSON.stringify([]));
      liquorArray = JSON.parse(localStorage.getItem("liquors"));
    }
    if (ingredientArray === null) {
      localStorage.setItem("ingredients", JSON.stringify([]));
      liquorArray = JSON.parse(localStorage.getItem("ingredients"));
    }
    if (type === "liquor") {
      if (liquorArray.includes(param) === false) {
        liquorArray.push(param);
        localStorage.setItem("liquors", JSON.stringify(liquorArray));
      } else {
        let index = liquorArray.indexOf(param);
        liquorArray.splice(index, 1);
        localStorage.setItem("liquors", JSON.stringify(liquorArray));
      }
    } else {
      if (ingredientArray.includes(param) === false) {
        ingredientArray.push(param);
        localStorage.setItem("ingredients", JSON.stringify(ingredientArray));
      } else {
        let index = ingredientArray.indexOf(param);
        ingredientArray.splice(index, 1);
        localStorage.setItem("ingredients", JSON.stringify(ingredientArray));
      }
    }
    fetchData();
  };
  const fetchData = async () => {
    let res = "";
    if (props.cardType === "liquor") {
      if (
        props.liquorText === "" ||
        props.liquorText.current === "Add Liquors" ||
        props.liquorText.current === ""
      ) {
        console.log("fired");
        res = await axios.get(
          "http://localhost:3000/justIngredients/type/liquor"
        );
      } else {
        res = await axios.get(
          "http://localhost:3000/justIngredients/" +
            props.cardType +
            "/" +
            props.liquorText
        );
      }

      let liquorArray = [];
      if (res.data[0] !== undefined) {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          liquorArray.push(
            <ButtonSelect
              type={"liquor"}
              nameLower={res.data[i].nameLower}
              name={res.data[i].name}
              handleButtonClick={handleButtonClick}
            />
          );
        }
      }

      console.log(liquorArray);
      setArray(liquorArray);
    }

    if (props.cardType === "ingredient") {
      if (
        props.ingredText === "" ||
        props.ingredText.current === "Add Ingredients" ||
        props.ingredText.current === ""
      ) {
        let ingredientArray = [];
        const res = await axios.get("http://localhost:3000/justIngredients");
        for (let ingred of res.data) {
          if (ingred.type === "liquor") {
            continue;
          }
          ingredientArray.push(
            <ButtonSelect
              type="ingredient"
              nameLower={ingred.nameLower}
              name={ingred.name}
              handleButtonClick={handleButtonClick}
            />
          );
        }
        setArray(ingredientArray);
      } else {
        //group call
        let one =
          "http://localhost:3000/justIngredients/liquid/" + props.ingredText;
        let two =
          "http://localhost:3000/justIngredients/herb/" + props.ingredText;
        let three =
          "http://localhost:3000/justIngredients/dry/" + props.ingredText;
        let four =
          "http://localhost:3000/justIngredients/fruit/" + props.ingredText;
        let five =
          "http://localhost:3000/justIngredients/other/" + props.ingredText;

        const reqOne = await axios.get(one);
        const reqTwo = await axios.get(two);
        const reqThree = await axios.get(three);
        const reqFour = await axios.get(four);
        const reqFive = await axios.get(five);
        let ingredientArray = [];
        axios
          .all([reqOne, reqTwo, reqThree, reqFour, reqFive])
          .then(
            axios.spread((...res) => {
              const resOne = res[0];
              const resTwo = res[1];
              const resThree = res[2];
              const resFour = res[3];
              const resFive = res[4];
              for (let liquid of resOne.data) {
                ingredientArray.push(
                  <ButtonSelect
                    type="ingredient"
                    nameLower={liquid.nameLower}
                    name={liquid.name}
                    handleButtonClick={handleButtonClick}
                  />
                );
              }

              for (let herb of resTwo.data) {
                ingredientArray.push(
                  <ButtonSelect
                    type="ingredient"
                    nameLower={herb.nameLower}
                    name={herb.name}
                    handleButtonClick={handleButtonClick}
                  />
                );
              }

              for (let dry of resThree.data) {
                ingredientArray.push(
                  <ButtonSelect
                    type="ingredient"
                    nameLower={dry.nameLower}
                    name={dry.name}
                    handleButtonClick={handleButtonClick}
                  />
                );
              }

              for (let fruit of resFour.data) {
                ingredientArray.push(
                  <ButtonSelect
                    type="ingredient"
                    nameLower={fruit.nameLower}
                    name={fruit.name}
                    handleButtonClick={handleButtonClick}
                  />
                );
              }

              for (let other of resFive.data) {
                ingredientArray.push(
                  <ButtonSelect
                    type="ingredient"
                    nameLower={other.nameLower}
                    name={other.name}
                    handleButtonClick={handleButtonClick}
                  />
                );
              }

              setArray(ingredientArray);
            })
          )
          .catch((errors) => {
            console.log(errors);
          });
      }
    }
  };
  // calls fetchData everytime the text changes and a different section is selected
  useEffect(() => {
    fetchData();
  }, [props.ingredText, props.liquorText, props.cardType]);

  // focous on the entire searchCard when there is card
  return (
    <div ref={searchWrapperRef} className="searchCard">
      <div className="divItemContainer">
        <div>{array} </div>
      </div>
    </div>
  );
};
export default SearchCard;
