import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const InfoMenu = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    axios.get("http://localhost:3000/account").then(function (res) {
      if (res.data.user === undefined) {
        setLogged(false);
      } else {
        setLogged(true);
        console.log(res);
      }
    });
  }, [logged]);

  const onClick = (shouldShow) => {
    setLogged(shouldShow);
  };
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret></DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
          {logged ? (
            <Link to="/personal">Your Drinks</Link>
          ) : (
            <div> Your Drinks</div>
          )}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>about</DropdownItem>
        <a href="http://localhost:3000/logout">
          <DropdownItem>logout </DropdownItem>
        </a>

        <a href="http://localhost:3000/auth/google/">
          <DropdownItem>Sign in (Google)</DropdownItem>
        </a>
      </DropdownMenu>
    </Dropdown>
  );
};

export default InfoMenu;
