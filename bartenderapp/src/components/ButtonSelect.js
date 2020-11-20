import React, { useState, useEffect } from "react";

import "../styles/SearchCard.css";

const ButtonSelect = (props) => {
  const [hasitem, setHasitem] = useState(false);
  const classes = `searchItem ${hasitem ? "colorButton" : ""}`;

  const checkLocal = async () => {
    let liquorArray = JSON.parse(localStorage.getItem("liquors"));
    let ingredientArray = JSON.parse(localStorage.getItem("ingredients"));

    //checks if there is an array made
    if (liquorArray === null) {
      localStorage.setItem("liquors", JSON.stringify([]));
      liquorArray = JSON.parse(localStorage.getItem("liquors"));
    }
    if (ingredientArray === null) {
      localStorage.setItem("ingredients", JSON.stringify([]));
      ingredientArray = JSON.parse(localStorage.getItem("ingredients"));
    }

    if (props.type === "liquor") {
      if (liquorArray.includes(props.nameLower) === true) {
        setHasitem(true);
      } else {
        setHasitem(false);
      }
    } else {
      if (ingredientArray.includes(props.nameLower) === true) {
        setHasitem(true);
      } else {
        setHasitem(false);
      }
    }
  };

  useEffect(() => {
    checkLocal();
  });
  return (
    <button
      className={classes}
      onClick={() => {
        props.handleButtonClick(props.nameLower, props.type);
      }}
    >
      {props.name}
    </button>
  );
};
export default ButtonSelect;
