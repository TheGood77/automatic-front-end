import React, { useState } from "react";
import { userService } from "../../../api/users";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

export function UserCreation() {
  const [user, setUser] = useState({ fio: "", tab_number: "", post: "" });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await userService.createUser(user);
      alert("User created successfully!");
    } catch (error) {
      alert("Error creating user!");
      console.error("Error creating user:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создать пользователя
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="ФИО"
            name="fio"
            value={user.fio}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Таб. номер"
            type="number"
            name="tab_number"
            value={user.tab_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Должность"
            name="post"
            value={user.post}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Создать
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default UserCreation;
