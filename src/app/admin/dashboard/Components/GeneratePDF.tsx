"use client";

import React, { useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { font } from "../../../../../public/Times New Roman.js";
import { userService } from "../../../api/users";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormLabel,
} from "@mui/material";
import {
  format,
  parse,
  eachDayOfInterval,
  nextSaturday,
  nextSunday,
} from "date-fns";
import { ru } from "date-fns/locale";

const addTNWFont = (doc: jsPDF) => {
  doc.addFileToVFS("TimesNewRoman.ttf", font);
  doc.addFont("TimesNewRoman.ttf", "TimesNewRoman", "normal");
  doc.setFont("TimesNewRoman");
};

const formatWorkDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "";

  const start = parse(startDate, "yyyy-MM-dd", new Date());
  const end = parse(endDate, "yyyy-MM-dd", new Date());

  const days = eachDayOfInterval({ start, end });
  const dayNumbers = days.map((date) => format(date, "d"));
  const monthYear = format(end, "MMMM yyyy", { locale: ru });

  return `${dayNumbers.join(", ")} ${monthYear}`;
};

const formatDate = (date: string) => {
  if (!date) return "";

  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, "dd.MM.yyyy");
};

export function GeneratePDF() {
  const [pdfData, setPdfData] = useState({
    workerListTitle: "TEST",
    startDate: format(nextSaturday(new Date()), "yyyy-MM-dd"),
    endDate: format(nextSunday(new Date()), "yyyy-MM-dd"),
    orderNumber: "1",
    orderDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPdfData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generatePDF = useCallback(async () => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();

    const [users, tables] = await Promise.all([
      userService.getUsers(),
      userService.getTables(),
    ]);
    console.log("Users:", users);
    console.log("Tables:", tables);

    doc.setFontSize(14);
    addTNWFont(doc);

    const head = [
      [
        "№",
        "ФИО",
        "Таб.\nномер",
        "Должность",
        "Дата\nвыхода",
        "Условия\nоплаты",
        "Задание (кратко)",
        "Номер\nзаказа",
        "Согласие\nработника\n(роспись)",
        "Отметка\nо выпол-\nнении",
      ],
    ];

    const body = users
      .map((user, index) => {
        const userTables = tables.filter((table) => table.user_id === user.id);
        const lastTable = userTables.reduce(
          (latest, table) =>
            new Date(table.created_at) > new Date(latest.created_at)
              ? table
              : latest,
          userTables[0]
        );

        return lastTable
          ? [
              [
                `${index + 1}.`,
                user.fio,
                user.tab_number,
                user.post,
                lastTable.date,
                lastTable.terms,
                lastTable.task,
                lastTable.order_number,
                "",
                "",
              ],
            ]
          : [];
      })
      .flat();

    console.log("Table body:", body);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 30,
      styles: {
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        font: "TimesNewRoman",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    doc.text(
      `Список работников ${pdfData.workerListTitle}
      \nдля выполнения работы в выходной/нерабочий праздничный день ${formatWorkDates(
        pdfData.startDate,
        pdfData.endDate
      )}
      \nсогласно приказу ${pdfData.orderNumber} от ${formatDate(
        pdfData.orderDate
      )}`,
      pageWidth / 2,
      10,
      { align: "center", lineHeightFactor: 0.6 }
    );

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  }, [pdfData]);

  return (
    <Container maxWidth="md">
      <Box mt={4} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Генерация PDF
        </Typography>
        <Box>
          <TextField
            label="Название списка работников"
            name="workerListTitle"
            value={pdfData.workerListTitle}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormLabel component="legend">Даты выполнения работы:</FormLabel>
          <TextField
            label="Начало"
            type="date"
            name="startDate"
            value={pdfData.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Конец"
            type="date"
            name="endDate"
            value={pdfData.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Номер приказа"
            type="number"
            name="orderNumber"
            value={pdfData.orderNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Дата приказа"
            type="date"
            name="orderDate"
            value={pdfData.orderDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={generatePDF}>
              Сгенерировать PDF файл
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default GeneratePDF;
