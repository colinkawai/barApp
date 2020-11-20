import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const FacetOne = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const mouseOver = () => {
    setHover(true);
  };
  const mouseOut = () => {
    setHover(false);
  };
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        className={hover ? "hover" : ""}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
      >
        Sort By
      </DropdownToggle>
      <DropdownMenu left>
        <DropdownItem>Most Popular(does nothing)</DropdownItem>
        <DropdownItem>Best Match (does nothing)</DropdownItem>
        <DropdownItem>Least Matching Ingredients</DropdownItem>
        <DropdownItem>Most Mathcing Ingredients</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FacetOne;
