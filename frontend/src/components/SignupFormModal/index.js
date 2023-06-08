import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled,setDisabled] = useState(true)

  useEffect(()=>{
    let disableButton = false

    if (!email.length || username.length < 4 || !firstName.length || !lastName.length || password.length < 6 || !confirmPassword.length) disableButton = true

    setDisabled(disableButton)
  },[email,username,firstName,lastName,password,confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            console.log(data)
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signUp-form-main">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
          placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          <input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          <input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signUp-forn-inputs"
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button className="signUp-form-submit-button" type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
