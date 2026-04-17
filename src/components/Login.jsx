import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import OtpInput from "react-otp-input";
import "react-phone-number-input/style.css";
import { clearAuthError, login } from "../features/authSlice";
import "./Login.scss";

const DEMO_OTP = "1234";
const RESEND_TIMEOUT = 30;

function getFieldErrors({ name, phone }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  const normalizedPhone = phone?.trim() || "";
  if (!normalizedPhone) errors.phone = "Phone number is required";
  else if (!isValidPhoneNumber(normalizedPhone))
    errors.phone = "Enter a valid phone number";
  return errors;
}

// Custom resend timer — no external dependency
function ResendTimer({ onResend }) {
  const [seconds, setSeconds] = useState(RESEND_TIMEOUT);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setSeconds(RESEND_TIMEOUT);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = () => {
    startTimer();
    onResend();
  };

  return (
    <button
      type="button"
      className="loginForm__resendButton"
      onClick={handleResend}
      disabled={seconds > 0}
    >
      {seconds > 0 ? `Resend OTP in ${seconds}s` : "Resend OTP"}
    </button>
  );
}

export default function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [resendKey, setResendKey] = useState(0);
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    otp: false,
    submitted: false,
  });

  const fieldErrors = getFieldErrors(formData);
  const canSendOtp =
    formData.name.trim() &&
    formData.phone &&
    !fieldErrors.phone &&
    !fieldErrors.name;

  const resetOtpState = () => {
    setOtp("");
    setOtpSent(false);
    setOtpInfo("");
    setOtpError("");
    setResendKey((k) => k + 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthError());
    if (otpError) setOtpError("");
    if (name === "name" && otpSent) resetOtpState();
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
    if (error) dispatch(clearAuthError());
    if (otpError) setOtpError("");
    if (otpSent) resetOtpState();
  };

  const handleFieldTouch = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSendOtp = () => {
    setTouched((prev) => ({ ...prev, name: true, phone: true }));
    if (!canSendOtp) {
      setOtpError("Enter a valid name and phone number before sending OTP.");
      return;
    }
    setOtp("");
    setOtpSent(true);
    setOtpError("");
    setOtpInfo(`OTP sent successfully. Use ${DEMO_OTP} for demo.`);
    setResendKey((k) => k + 1);
    if (error) dispatch(clearAuthError());
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpError("");
    setOtpInfo(`OTP resent successfully. Use ${DEMO_OTP} for demo.`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, phone: true, otp: true, submitted: true });
    if (Object.keys(fieldErrors).length > 0) return;
    if (!otpSent) {
      setOtpError("Send the OTP before verifying.");
      return;
    }
    if (otp !== DEMO_OTP) {
      setOtpError("Enter the correct OTP to continue.");
      return;
    }
    setOtpError("");
    dispatch(login({ name: formData.name, phone: formData.phone }));
  };

  const showNameError = (touched.name || touched.submitted) && fieldErrors.name;
  const showPhoneError =
    (touched.phone || touched.submitted) && fieldErrors.phone;
  const showOtpError = (touched.otp || touched.submitted) && otpError;

  return (
    <section className="loginPanel">
      <div className="loginPanel__content">
        <p className="loginPanel__eyebrow">Secure Sign In</p>
        <h1>Login</h1>
        <p className="loginPanel__intro">
          Continue with your name and mobile number, then verify the OTP to
          enter the store.
        </p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginForm__field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleFieldTouch("name")}
              aria-invalid={Boolean(showNameError)}
              aria-describedby={showNameError ? "login-name-error" : undefined}
            />
            {showNameError && (
              <p
                id="login-name-error"
                className="loginForm__message loginForm__message--error"
              >
                {fieldErrors.name}
              </p>
            )}
          </label>

          <div className="loginForm__field">
            <span>Phone Number</span>
            <div className="loginForm__phoneRow">
              <PhoneInput
                international
                defaultCountry="IN"
                countryCallingCodeEditable={false}
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleFieldTouch("phone")}
                className={`loginForm__phoneInput ${showPhoneError ? "loginForm__phoneInput--error" : ""}`}
              />
              <button
                type="button"
                className="loginForm__otpButton"
                onClick={handleSendOtp}
                disabled={!canSendOtp || otpSent}
              >
                {otpSent ? "OTP Sent ✓" : "Send OTP"}
              </button>
            </div>
            {!otpSent && (
              <p className="loginForm__message loginForm__message--hint">
                Enter your name and a valid mobile number, then click
                &ldquo;Send OTP&rdquo;.
              </p>
            )}
            {showPhoneError && (
              <p className="loginForm__message loginForm__message--error">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {otpSent && (
            <div className="loginForm__otpBlock">
              <div className="loginForm__field">
                <span>Enter OTP</span>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderInput={(props) => (
                    <input {...props} className="loginForm__otpInput" />
                  )}
                  containerStyle="loginForm__otp"
                  shouldAutoFocus
                  inputType="tel"
                />
              </div>

              {otpInfo && (
                <p className="loginForm__message loginForm__message--info">
                  {otpInfo}
                </p>
              )}

              {showOtpError && (
                <p className="loginForm__message loginForm__message--error">
                  {otpError}
                </p>
              )}

              <ResendTimer key={resendKey} onResend={handleResendOtp} />
            </div>
          )}

          {error && (
            <p className="loginForm__message loginForm__message--error">
              {error}
            </p>
          )}

          <button className="loginForm__submit" type="submit">
            Verify OTP
          </button>
        </form>
      </div>
    </section>
  );
}
