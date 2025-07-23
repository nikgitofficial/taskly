// pages/ForgotPassword.jsx
import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Snackbar, Alert
} from "@mui/material";
import axios from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const sendOtpHandler = async () => {
    try {
      await axios.post("/auth/forgot-password", { email });
      setOtpSent(true);
      setMsg("OTP sent to email");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
  };

  const resetPasswordHandler = async () => {
    try {
      await axios.post("/auth/reset-password", { email, otp, newPassword });
      setMsg("Password reset successful!");
      setOtpSent(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>

      <TextField
        fullWidth label="Email" margin="normal"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />

      {otpSent && (
        <>
          <TextField
            fullWidth label="OTP" margin="normal"
            value={otp} onChange={(e) => setOtp(e.target.value)}
          />
          <TextField
            fullWidth label="New Password" type="password" margin="normal"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          />
        </>
      )}

      <Button
        fullWidth variant="contained" sx={{ mt: 2 }}
        onClick={otpSent ? resetPasswordHandler : sendOtpHandler}
      >
        {otpSent ? "Reset Password" : "Send OTP"}
      </Button>

      <Snackbar open={!!msg} autoHideDuration={4000} onClose={() => setMsg("")}>
        <Alert onClose={() => setMsg("")} severity="success">{msg}</Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert onClose={() => setError("")} severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
