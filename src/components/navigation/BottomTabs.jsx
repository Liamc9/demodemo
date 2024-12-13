// IMPORTS
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { UsersIcon, HomeIcon, SearchIcon } from "../icons/Icons";

// CREATE FUNCTION
export default function BottomTabs() {
  // STATE VARIABLES
  const activeStyle = { color: "#DF5BFF", backgroundColor: "#F3F4F6" };


  // HTML
  return (
    <>
      <head></head>
      <body>
        <div className="flex justify-center">
          <div
            className="border-1 fixed bottom-5 z-20 mx-5 w-full max-w-md rounded-lg border border-gray-500 bg-white"
            style={{ boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}
          >
            <ul className="flex justify-between text-sm font-medium text-gray-600">
              <li className="flex-1">
                <NavLink
                  to="/search"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  className="flex flex-col items-center justify-center rounded-s-lg p-2"
                >
                  <SearchIcon
                    className="text-lg"
                  />
                  <span className="mt-1 text-xs">Browse</span>
                </NavLink>
              </li>
              <li className="flex-1">
                <NavLink
                  to="/mylistings"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  className="flex flex-col items-center justify-center p-2"
                >
                  <div className="relative">
                    <HomeIcon className="text-lg" />
                    
                  </div>
                  <span className="mt-1 text-xs">My Listings</span>
                </NavLink>
              </li>
              <li className="flex-1">
                <NavLink
                  to="/enquiries"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  className="flex flex-col items-center justify-center p-2"
                >
                  <div className="relative">
                    <UsersIcon className="text-lg" />
                    
                  </div>
                  <span className="mt-1 text-xs">My Enquiries</span>
                </NavLink>
              </li>
              <li className="flex-1">
                <NavLink
                  to="/mysublets"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  className="flex flex-col items-center justify-center rounded-e-lg p-2"
                >
                  <div>
                    <svg viewBox="-250 100 750 320" className="fill-current">
                      <g>
                        <rect
                          x="57.584"
                          y="141.502"
                          width="53.371"
                          height="243.68"
                          rx="3.511"
                          ry="3.511"
                        ></rect>
                      </g>
                      <g>
                        <rect
                          x="58.288"
                          y="331.812"
                          width="251.404"
                          height="54.775"
                          rx="2.809"
                          ry="2.809"
                        ></rect>
                      </g>
                      <rect
                        x="124.298"
                        y="143.61"
                        width="182.584"
                        height="54.073"
                        rx="2.809"
                        ry="2.809"
                      ></rect>
                      <rect
                        x="124.297"
                        y="265.099"
                        width="182.584"
                        height="51.967"
                        rx="3.511"
                        ry="3.511"
                      ></rect>
                      <path d="M 306.18 143.609 L 304.775 198.385 C 304.775 202.986 125 315.66 125 315.66 L 125.702 265.098 L 306.18 143.609 Z"></path>
                    </svg>
                    <span className="mt-1 text-xs">My Lettz</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </body>
    </>
  );
}
