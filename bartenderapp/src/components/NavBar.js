import React, { useState } from "react";
import InfoMenu from "./InfoMenu";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../styles/NavBar.css";
function NavBar(props) {
  let liquorsButtonText = `${props.liquorsPersonal.toString()}/${props.liquorsTotal.toString()} Liquors`;
  let ingredientsButtonText = `${props.ingredientsPersonal.toString()}/${props.ingredientsTotal.toString()} Ingredients`;
  const [hover, setHover] = useState(false);
  const [infoHover, setInfoHover] = useState(false);
  const infoMouseOver = () => {
    setInfoHover(true);
  };
  const infoMouseOut = () => {
    setInfoHover(false);
  };
  const mouseOver = () => {
    setHover(true);
  };
  const mouseOut = () => {
    setHover(false);
  };
  const onButtonClick = (event) => {
    event.preventDefault();
    event.currentTarget.blur();
  };
  return (
    <div className="NavContainer">
      <div id="title">Brtndr</div>

      <div className={"centerButtons "}>
        <div
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
          className={"innerCenterButton " + (hover ? "hover" : "")}
        >
          <button
            id="leftButton"
            className="button"
            onClick={(e) => {
              props.toggleTopMenu();
              onButtonClick(e);
            }}
          >
            {liquorsButtonText}
          </button>
          <button
            className="button"
            id="ingredientsButton"
            onClick={(e) => {
              props.toggleTopMenu();
              onButtonClick(e);
            }}
          >
            {ingredientsButtonText}
          </button>
          <button
            id="keyWordButton"
            className="button"
            onClick={(e) => {
              props.toggleTopMenu();
              onButtonClick(e);
            }}
          >
            Keywords
          </button>
          <button
            id="rightButton"
            className="button"
            onClick={(e) => {
              props.toggleTopMenu();
              onButtonClick(e);
            }}
          >
            <i className="gg-search"></i>
          </button>
        </div>
      </div>
      <div id="infoButton">
        <div
          onMouseOver={infoMouseOver}
          onMouseOut={infoMouseOut}
          className={"innerInfoButton " + (infoHover ? "hover" : "")}
        >
          <InfoMenu />
        </div>
      </div>
    </div>
  );
}
export default NavBar;
