import React, { useState } from "react";
import "../styles/Facets.css";
import FacetOne from "./FacetOne";

const AllFacets = (props) => {
  return (
    <div className="facetSelection">
      <div id="facetOne">
        <FacetOne />
      </div>
      <div id="faceTwo">
        <button id="yourDrinks" onClick={}>
          {" "}
          your drinks
        </button>
      </div>
    </div>
  );
};
export default AllFacets;
