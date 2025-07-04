// pages/NotAuthorized.jsx
import { Box, Typography } from "@mui/material";

const NotAuthorized = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Typography variant="h4" color="error">
        403 - Not Authorized this page is only for Admins
      </Typography>
    </Box>
  );
};

export default NotAuthorized;
