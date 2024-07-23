"use client";

import React, { useState } from "react";
import { adminService } from "../api/admin";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await adminService.login(password);
      router.push("/admin/dashboard"); // Переход на админскую панель
    } catch (error) {
      setError("Invalid password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="password"
            label="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Admin;
