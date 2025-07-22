// src/components/Footer.jsx
import { Box, Typography, Stack, Link, Divider } from "@mui/material";
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
        px: 2,
        py: 3,
        mt: "auto",
        borderTopLeftRadius: "50px 20px",
        borderTopRightRadius: "50px 50px",
        boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
        width: "100vw", // ✅ Force full viewport width
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
      >
        {/* Logo and Info */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Box
            component="img"
            src={Logo}
            alt="Taskly Logo"
            sx={{
              height: 50,
              width: "auto",
              borderRadius: "10px",
              maxWidth: "100%",
            }}
          />
          <Typography variant="body2" color="gray" noWrap>
            &copy; {new Date().getFullYear()} Taskly. Crafted with ❤️ by Nikko MP.
          </Typography>
        </Stack>

        {/* Quick Links */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: "center", md: "flex-end" }}
        >
          <FooterLink href="/about" icon={<InfoIcon fontSize="small" />} label="About Us" />
          <FooterLink href="/contact" icon={<ContactPageIcon fontSize="small" />} label="Contact" />
          <FooterLink href="https://mail.google.com/mail/?view=cm&to=nickforjobacc@gmail.com" icon={<EmailIcon fontSize="small" />} label="Gmail"/>
          <FooterLink href="https://nikkopaceno.com/ambotoy" icon={<FacebookIcon fontSize="small" />} label="Facebook" />
          <FooterLink href="https://github.com/nikgitofficial" icon={<GitHubIcon fontSize="small" />} label="GitHub" />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "#444" }} />

      <Typography variant="caption" color="gray" textAlign="center" display="block">
        All rights reserved.
      </Typography>
    </Box>
  );
};

const FooterLink = ({ href, icon, label }) => (
  <Link
    href={href}
    target={href.startsWith("http") ? "_blank" : "_self"}
    underline="none"
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      color: "white",
      fontSize: 14,
      transition: "color 0.2s",
      whiteSpace: "nowrap",
      "&:hover": {
        color: "#21cbf3",
      },
    }}
  >
    {icon} {label}
  </Link>
);

export default Footer;
