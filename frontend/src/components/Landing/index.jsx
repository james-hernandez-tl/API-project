import "./Landing.css";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";

export default function Landing() {
  const { setModalContent, setOnModalClose, closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Demo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({ credential: "demo@user.io", password: "password" })
    )
      .then(closeModal)
      .then(() => navigate("/groups"))
      .catch(async (res) => {
        const data = await res.json();
      });
  };

  return (
    <div className="LandingPage">
      <div className="LandingPage-left">
        <div className="LandingPage-left-title">Meetup!</div>
        <div className="LandingPage-left-body">
          Whatever your interest, from hiking and reading to networking and
          skill sharing, there are thousands of people who share it on Meetup.
          Events are happening every day—sign up to join the fun.
        </div>
        <div className="LandingPage-left-button-wrapper">
          <button onClick={() => setModalContent(<SignupFormModal />)}>
            JOIN MEETUP NOW
          </button>
        </div>
      </div>
      <div className="LandingPage-right">
        <div className="LandingPage-right-button-wrapper">
          <button onClick={() => setModalContent(<LoginFormModal />)}>
            LOG IN
          </button>
          <button onClick={() => setModalContent(<SignupFormModal />)}>
            SIGN UP
          </button>
          <div className="LandingPage-right-demoUser" onClick={Demo}>
            CONTINUE AS DEMO USER
          </div>
        </div>
        <div>
          <img
            className="LandingPage-right-main-img"
            src="https://cdn.discordapp.com/attachments/934145502252003410/1133880174488866907/20230726_235417_0001.png"
          ></img>
        </div>
        <div className="LandingPage-right-footer">
          <div>
            <img
              src="https://cdn.discordapp.com/attachments/934145502252003410/1133862357181935838/20230726_224302_0003.png"
              alt=""
              className="LandingPage-right-icon"
            />
            <div onClick={() => navigate("/groups/new")}>CREATE GROUPS</div>
          </div>
          <div>
            <img
              src="https://cdn.discordapp.com/attachments/934145502252003410/1133862358050164886/20230726_224302_0002.png"
              alt=""
              className="LandingPage-right-icon"
            />
            <div onClick={() => navigate("/groups")}>JOIN GROUPS</div>
          </div>
          <div>
            <img
              src="https://cdn.discordapp.com/attachments/934145502252003410/1133862358503129178/20230726_224302_0001.png"
              alt=""
              className="LandingPage-right-icon"
            />
            <div onClick={() => navigate("/events")}>ATTEND EVENTS</div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
