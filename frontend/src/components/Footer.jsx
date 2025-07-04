import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: "80px",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: "50px 20px",
        borderTopRightRadius: "50px 20px",
        boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
        mt: "auto", // ✅ Push to bottom only if needed
      }}
    >
      <Typography variant="body2" align="center">
        &copy; {new Date().getFullYear()} Taskly. Crafted with ❤️ by Nikko MP. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
