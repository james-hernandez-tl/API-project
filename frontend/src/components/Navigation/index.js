import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import useTheme from "../../hooks/useTheme";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [search, setSearch] = useState("");
  const { theme, setTheme } = useTheme();
  const [isHome, setIsHome] = useState(true);
  // const searchBar = useQuery();
  // console.log(searchBar.get("search"));

  useEffect(() => {
    if ((window.location.pathname === "/") !== isHome) setIsHome(!isHome);
  });

  if (isHome) return null;

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div className="navigation-button-holder">
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  const searchFor = (e) => {
    console.log(e.key);
  };

  return (
    <>
      <div className="navigation">
        <div className="navifation-logo-search-wrapper">
          <NavLink className="navigation-logo" exact={"true"} to="/">
            Meetup
          </NavLink>
          <div>
            <input
              type="text"
              placeholder="search anything"
              onClick={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={searchFor}
            ></input>
          </div>
          <div
            onClick={() => {
              if (theme == "Dark") setTheme("light");
              else setTheme("Dark");
            }}
          >
            Swap
          </div>
        </div>
        <div className="navigation-right">
          {sessionUser && (
            <NavLink to="/groups/new" className="startGroup">
              Start a new group
            </NavLink>
          )}
          {isLoaded && sessionLinks}
        </div>
      </div>
    </>
  );
}

export default Navigation;
