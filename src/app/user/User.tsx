"use client";

import React, { useState, useEffect } from "react";
import { User } from "../types";
import { userService } from "../api/users";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box,
  InputLabel,
} from "@mui/material";
import { eachDayOfInterval, format, nextSaturday, nextSunday } from "date-fns";

const getNextWeekends = () => {
  const today = new Date();
  const firstWeekend = nextSaturday(today);
  const secondWeekend = nextSunday(today);

  const days = eachDayOfInterval({ start: firstWeekend, end: secondWeekend });
  const dayNumbers = days.map((date) => format(date, "d"));

  return `${dayNumbers.join(", ")}`;
}

export function UserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    user_id: "",
    date: getNextWeekends(),
    terms: "",
    task: "",
    number_order: "",
  });
  const [numberOrderError, setNumberOrderError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersList: User[] = await userService.getUsers();
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Проверка номера заказа
    if (name === "number_order") {
      validateNumberOrder(value);
    }
  };

  const validateNumberOrder = (value: string) => {
    const regex = /^\d{2}-\d{6}$/;
    if (!regex.test(value)) {
      setNumberOrderError(
        "Номер заказа должен соответствовать формату: 12-345678"
      );
    } else {
      setNumberOrderError(null);
    }
  };

  const validateForm = () => {
    const { user_id, date, terms, task, number_order } = formData;

    if (!user_id || !date || !terms || !task || !number_order) {
      setFormError("Пожалуйста, заполните все обязательные поля.");
      return false;
    }

    if (numberOrderError) {
      setFormError("Исправьте ошибки перед отправкой.");
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Исправьте ошибки перед отправкой.");
      return;
    }

    const table = {
      date: formData.date,
      terms: formData.terms,
      task: formData.task,
      order_number: formData.number_order,
      user_id: parseInt(formData.user_id, 10),
    };
    try {
      await userService.createTable(table);
      alert("Table created successfully!");
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Введите данные
        </Typography>
        {formError && (
          <Typography color="error" variant="body2" gutterBottom>
            {formError}
          </Typography>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-select-label">Выберите ФИО</InputLabel>
          <Select
            labelId="user-select-label"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Выберите ФИО</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.fio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Дата выхода"
          placeholder="Введите дату"
          name="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Условия</FormLabel>
          <RadioGroup
            row
            name="terms"
            value={formData.terms}
            onChange={handleChange}
          >
            <FormControlLabel
              value="Оплата"
              control={<Radio />}
              label="Оплата"
            />
            <FormControlLabel value="Отгул" control={<Radio />} label="Отгул" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Задание"
          name="task"
          value={formData.task}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Номер заказа"
          name="number_order"
          value={formData.number_order}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!numberOrderError}
          helperText={numberOrderError}
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Отправить
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UserForm;
