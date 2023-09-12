import "./home.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useTheme from "../../hooks/useTheme";

export default function Home() {
  const user = useSelector((state) => state.session.user);
  const [disableStart, setDisableStart] = useState(true);
  const { theme } = useTheme;

  useEffect(() => {
    if (user) setDisableStart(false);
    else setDisableStart(true);
  }, [user]);

  const startGroupClicker = (e) => {
    if (disableStart) e.preventDefault();
  };

  return (
    <main>
      <div className="home-section1">
        <div className="home-section1-text">
          <div className="home-section1-text-header">
            The people platform - Where interests become friendships
          </div>
          <div className="home-section1-text-body">
            Whatever your interest, from hiking and reading to networking and
            skill sharing, there are thousands of people who share it on Meetup.
            Events are happening every day—sign up to join the fun.
          </div>
        </div>
        <div>
          <img
            className="home-main-img"
            src="https://mail.google.com/mail/u/0?ui=2&ik=3ad22f5556&attid=0.4&permmsgid=msg-f:1772505178569136457&th=189934119b275949&view=att&disp=safe&realattid=1899340d37313f5d5fd1"
          ></img>
        </div>
      </div>

      <div className="home-section2">
        <h3>How Meetup works</h3>
        <div>
          a whole bunch of random works put together to form a decent sized
          sentence
        </div>
      </div>

      <div className="home-section3">
        <div className="home-seeGroup">
          <div className="home-img">
            <img
              src="https://mail.google.com/mail/u/0?ui=2&ik=3ad22f5556&attid=0.2&permmsgid=msg-f:1772505178569136457&th=189934119b275949&view=att&disp=safe&realattid=1899340d3c7dbe56d584"
              alt=""
            />
          </div>
          <NavLink exact={"true"} to="/groups">
            See all groups
          </NavLink>
          <div className="home-section3-captions">
            Look at all the wonderful groups for you to join!
          </div>
        </div>
        <div className="home-findEvents">
          <div className="home-img">
            <img
              src="https://mail.google.com/mail/u/0?ui=2&ik=3ad22f5556&attid=0.1&permmsgid=msg-f:1772505178569136457&th=189934119b275949&view=att&disp=safe&realattid=1899340d3b1dc1dcb5c3"
              alt=""
            />
          </div>
          <NavLink exact={"true"} to="/events">
            find an event
          </NavLink>
          <div className="home-section3-captions">
            Look at all the wonderful groups for you to join!
          </div>
        </div>

        <div className="home-startGroup">
          <div className="home-img">
            <img
              src="https://mail.google.com/mail/u/0?ui=2&ik=3ad22f5556&attid=0.3&permmsgid=msg-f:1772505178569136457&th=189934119b275949&view=att&disp=safe&realattid=1899340d39e9cd222de2"
              alt=""
            />
          </div>
          <NavLink
            className={disableStart ? "disable" : ""}
            exact={"true"}
            to="/groups/new"
            onClick={startGroupClicker}
          >
            Start a new group
          </NavLink>
          <div className="home-section3-captions">
            Look at all the wonderful groups for you to join!
          </div>
        </div>
      </div>

      <div className="home-section4">
        <button className="join-meetup-button">Join Meetup</button>
      </div>
    </main>
  );
}
