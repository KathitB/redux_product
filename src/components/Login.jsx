import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../features/authSlice";
import "./Login.scss";

function getFieldErrors({ email, password }) {
  const errors = {};
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Enter a valid email address";
  }

  if (!trimmedPassword) {
    errors.password = "Password is required";
  } else if (trimmedPassword.length < 5) {
    errors.password = "Password must be at least 5 characters";
  }

  return errors;
}

export default function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    submitted: false,
  });

  const fieldErrors = getFieldErrors(formData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched((prev) => ({
      ...prev,
      email: true,
      password: true,
      submitted: true,
    }));

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    dispatch(login(formData));
  };

  const showEmailError =
    (touched.email || touched.submitted) && fieldErrors.email;
  const showPasswordError =
    (touched.password || touched.submitted) && fieldErrors.password;

  return (
    <section className="loginPanel">
      <div className="loginPanel__content">
        <h1>Login</h1>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginForm__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter Email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(showEmailError)}
              aria-describedby={
                showEmailError ? "login-email-error" : undefined
              }
            />
            {showEmailError && (
              <p
                id="login-email-error"
                className="loginForm__message loginForm__message--error"
              >
                {fieldErrors.email}
              </p>
            )}
          </label>

          <label className="loginForm__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(showPasswordError)}
              aria-describedby={
                showPasswordError ? "login-password-error" : undefined
              }
            />
            {showPasswordError && (
              <p
                id="login-password-error"
                className="loginForm__message loginForm__message--error"
              >
                {fieldErrors.password}
              </p>
            )}
          </label>

          {error && (
            <p className="loginForm__message loginForm__message--error">
              {error}
            </p>
          )}

          <button className="loginForm__submit" type="submit">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
