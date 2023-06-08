import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user)

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

  return (
    <>
    <div className="navigation">
      <div>
        <NavLink className='navigation-logo' exact={true} to="/">
          Meetup
        </NavLink>

      </div>
      <div className="navigation-right">
        {sessionUser && <NavLink to="/groups/new" className="startGroup">Start a new group</NavLink>}
        {isLoaded && sessionLinks}
      </div>

    </div>
    <hr />
    </>
  );
}

export default Navigation;
