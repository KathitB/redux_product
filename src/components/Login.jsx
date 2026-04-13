import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../features/authSlice";
import "./Login.scss";

export default function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      return;
    }

    dispatch(login(formData));
  };

  const showValidation =
    touched && (!formData.email.trim() || !formData.password.trim());

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
            />
          </label>

          <label className="loginForm__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <button className="loginForm__submit" type="submit">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
