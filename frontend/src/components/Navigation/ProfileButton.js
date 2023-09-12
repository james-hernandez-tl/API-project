import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    history("/");
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-wrapper">
      <img
        src="https://media.discordapp.net/attachments/934145502252003410/1129211702546796554/Screen_Shot_2023-07-13_at_8.43.39_PM.png?width=1192&height=1068"
        className="profile-avatar"
        onClick={openMenu}
      />
      <div className={ulClassName} ref={ulRef}>
        <div>Hello, {user.firstName || user.username}</div>
        {/* <li>{user.firstName} {user.lastName}</li> */}
        <div className="profile-user-email">{user.email}</div>
        <div className="profile-link-holders">
          <Link exact={"true"} to="/groups">
            View Groups
          </Link>
        </div>
        <div className="profile-link-holders">
          <Link exact={"true"} to="/events">
            View Events
          </Link>
        </div>
        <div className="profile-log-out-button-holder">
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
