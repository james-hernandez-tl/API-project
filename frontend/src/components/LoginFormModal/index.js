import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disable, setDisable] = useState(true);
  let navigate = useNavigate();

  const Demo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({ credential: "demo@user.io", password: "password" })
    )
      .then(closeModal)
      .then(() => navigate("/groups"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .then(() => navigate("/groups"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    let disableButton = false;

    if (credential.length < 4 || password.length < 6) disableButton = true;

    setDisable(disableButton);
  });

  return (
    <div className="logIn-main-div">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="logIn-input"
          />
        </label>
        <label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="logIn-input"
          />
        </label>
        {errors.credential && (
          <p className="log-in-form-errors">{errors.credential}</p>
        )}
        <button className="logIn-form-logIn" type="submit" disabled={disable}>
          Log In
        </button>
        <button className="logIn-form-demoUser" type="demo" onClick={Demo}>
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
