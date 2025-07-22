// src/components/Footer.jsx
import { Box, Typography, Stack, IconButton, Link, Divider } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import Logo from "../assets/logo1.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#222",
        color: "white",
        px: 4,
        py: 3,
        mt: "auto",
        borderTopLeftRadius: "50px 20px",
        borderTopRightRadius: "50px 20px",
        boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Logo and Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component="img"
            src={Logo}
            alt="Taskly Logo"
            sx={{ height: 50, width: "auto", borderRadius: "10px" }}
          />
          <Typography variant="body2" color="gray">
            &copy; {new Date().getFullYear()} Taskly. Crafted with ❤️ by Nikko MP.
          </Typography>
        </Stack>

        {/* Quick Links */}
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Link href="/about" underline="none" sx={linkStyle}>
            <InfoIcon fontSize="small" /> About Us
          </Link>
          <Link href="/contact" underline="none" sx={linkStyle}>
            <ContactPageIcon fontSize="small" /> Contact
          </Link>
          <Link href="mailto:nickforjobacc@gmail.com" underline="none" sx={linkStyle}>
            <EmailIcon fontSize="small" /> Gmail
          </Link>
          <Link href="https://nikkopaceno.com/ambotoy" target="_blank" underline="none" sx={linkStyle}>
            <FacebookIcon fontSize="small" /> Facebook
          </Link>
          <Link href="https://github.com/nikgitofficial" target="_blank" underline="none" sx={linkStyle}>
            <GitHubIcon fontSize="small" /> GitHub
          </Link>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "#444" }} />

      <Typography variant="caption" color="gray" textAlign="center" display="block">
        All rights reserved.
      </Typography>
    </Box>
  );
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  color: "white",
  fontSize: 14,
  transition: "color 0.2s",
  "&:hover": {
    color: "#21cbf3",
  },
};

export default Footer;
