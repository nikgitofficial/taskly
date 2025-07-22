import { Box, Container, Typography, TextField, Button, Card, CardContent, useTheme, Fade, Snackbar, Alert } from "@mui/material";
import axios from "../api/axios"; // adjust path to your axios instance
import { useState } from "react";

const Contact = () => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/contact", form);
      setOpen(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to send message.");
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, py: { xs: 4, md: 8 }, minHeight: "100vh", background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", background: "linear-gradient(135deg, #6a11cb, #2575fc)", color: "#fff", p: 4 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>Contact Us</Typography>
              <Typography variant="body1" textAlign="center" mb={4} sx={{ opacity: 0.9 }}>Have questions? Send us a message.</Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField name="name" label="Your Name" variant="filled" required value={form.name} onChange={handleChange} InputProps={{ style: { backgroundColor: "#fff", borderRadius: 8 } }} />
                <TextField name="email" label="Your Email" type="email" variant="filled" required value={form.email} onChange={handleChange} InputProps={{ style: { backgroundColor: "#fff", borderRadius: 8 } }} />
                <TextField name="message" label="Message" multiline rows={4} variant="filled" required value={form.message} onChange={handleChange} InputProps={{ style: { backgroundColor: "#fff", borderRadius: 8 } }} />
                <Button type="submit" size="large" sx={{ mt: 2, background: "linear-gradient(135deg, #ff6b6b, #f06595)", color: "#fff", fontWeight: "bold", "&:hover": { background: "linear-gradient(135deg, #f06595, #ff6b6b)", boxShadow: "0 8px 18px rgba(0,0,0,0.2)" } }}>Send Message</Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>Message sent successfully!</Alert>
      </Snackbar>

      {error && <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setError("")} sx={{ width: "100%" }}>{error}</Alert>
      </Snackbar>}
    </Box>
  );
};

export default Contact;
