import React from "react";
import { Container, Typography, Box } from "@mui/material";

const AdminHome = () => {
  return (
    <Container maxWidth="md">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Page
        </Typography>
        <Typography variant="body1">
          Welcome to the admin dashboard. Use this page to manage users, view reports, and perform admin tasks.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminHome;
