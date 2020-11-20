import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ContentEditable from "react-contenteditable";
import ReactDOM from "react-dom";
import SearchCard from "./SearchCard";
import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/TopMenu.css";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const TopMenu = (props) => {
  const { buttonLabel, className } = props;

  const [drop, setDrop] = useState(false);
  const [liquor, setLiquor] = useState("");
  const [ingred, setIngred] = useState("");
  const [keyword, setKeyword] = useState("");
  const [focusOnDifferentButton, setFocusOnDifferentButton] = useState("");
  let [card, setCard] = useState("");
  const prevCard = usePrevious(card);

  const liquorText = useRef("Add Liquors");
  const ingredientsText = useRef("Add Ingredients ");
  const keywordText = useRef(" Add Keyword");

  useEffect(() => {
    props.updateDrinkIngredCount();
  }, [drop]);

  const handleChangeLiquor = (evt) => {
    liquorText.current = evt.target.value;
    setLiquor(liquorText.current);
  };

  const handleChangeIngredients = (e) => {
    ingredientsText.current = e.target.value;
    setIngred(ingredientsText.current);
  };

  const handleChangeKeyword = (e) => {
    keywordText.current = e.target.value;
    setKeyword(keywordText.current);
  };
  //remove placeholder
  const handleFocus = (focusType) => {
    if (focusType === "liquor") {
      liquorText.current = "";
      setLiquor(liquorText);
    }
    if (focusType === "ingredient") {
      ingredientsText.current = "";
      setIngred(ingredientsText);
    }
    if (focusType === "keyword") {
      keywordText.current = "";
      setKeyword(keywordText);
    }
  };

  //re add placeholder
  const handleBlur = () => {
    liquorText.current = "Add Liquors";
    ingredientsText.current = "Add Ingredients";
    keywordText.current = "Add Keyword";
  };

  // if outside click is detected true and focusOnButton is true
  // set toggle to true
  // if outside click is detected and focusOnButton is false
  //set toggle to false
  const toggleCard = (shouldShowDrop, cardType, outsideSearchCardClick) => {
    if (outsideSearchCardClick && focusOnDifferentButton) {
      setDrop(true);
      setCard(card); // keep the card type
    } else {
      setDrop(shouldShowDrop);
      setCard(cardType);
    }
  };
  return (
    <div>
      <Modal
        isOpen={props.modal}
        modalTransition={{ timeout: 300 }}
        backdropTransition={{ timeout: 500 }}
        toggle={props.toggleTopMenu}
      >
        <div id="modalContentContainer">
          <ModalHeader
            toggle={props.toggleTopMenu}
            onClick={() => {
              toggleCard(false);
            }}
          ></ModalHeader>
          <ModalBody>
            <div className="buttonContainer">
              <button
                className="selectButton"
                onClick={() => {
                  toggleCard(true, "liquor");
                }}
              >
                Liquor
                <ContentEditable
                  className="insideButton"
                  disabled={false}
                  html={liquorText.current}
                  onBlur={handleBlur}
                  onChange={handleChangeLiquor}
                  onFocus={() => {
                    handleFocus("liquor");
                  }}
                />
              </button>

              <button
                className="selectButton"
                onClick={() => {
                  toggleCard(true, "ingredient");
                }}
              >
                Ingredients
                <ContentEditable
                  className="insideButton"
                  disabled={false}
                  html={ingredientsText.current}
                  onBlur={handleBlur}
                  onChange={handleChangeIngredients}
                  onFocus={() => {
                    handleFocus("ingredient");
                  }}
                />
              </button>
              <button
                className="selectButton"
                onClick={() => {
                  toggleCard(true, "keyword");
                }}
              >
                Keywords
                <ContentEditable
                  className="insideButton"
                  disabled={false}
                  html={keywordText.current}
                  onBlur={handleBlur}
                  onChange={handleChangeKeyword}
                  onFocus={() => {
                    handleFocus("keyword");
                  }}
                />
              </button>
              <button
                className="searchButton"
                onClick={() => {
                  toggleCard(false);
                  props.toggleTopMenu();
                  props.updateDrinksState();
                }}
              >
                <i className="gg-search"></i>
              </button>
            </div>
            <div className="searchCardContainer">
              {drop ? (
                <SearchCard
                  cardType={card}
                  liquorText={liquor}
                  ingredText={ingred}
                  keywordText={keyword}
                  onMenuBlur={handleBlur}
                  toggleCard={toggleCard}
                  focusOnDifferentButton={focusOnDifferentButton}
                />
              ) : (
                <div></div>
              )}
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </div>
      </Modal>
    </div>
  );
};

export default TopMenu;
