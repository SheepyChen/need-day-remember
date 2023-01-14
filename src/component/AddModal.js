import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Button,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Radio,
} from "@mui/material";
import { isEmpty, get } from "lodash";
import PropTypes from "prop-types";
import SendIcon from "@mui/icons-material/Send";
import { fs } from "../utils/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { SPEND_OPTIONS, INCOME_OPTIONS } from "../utils/const";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", sm: "60%", lg: "40%" },
  bgcolor: "background.paper",
  border: "1px solid #767676",
  boxShadow: 24,
  p: 4,
};

export default function AddModal(props) {
  const { handleClose, open, theme, title, defaultValue, userId } = props;
  const type = get(props, "type", "Spending");
  const id = get(defaultValue, "id", "");
  const [category, setCategory] = useState(get(defaultValue, "category", ""));
  const [selectedValue, setSelectedValue] = useState(type);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState(get(defaultValue, "name", ""));
  const [amount, setAmount] = useState(get(defaultValue, "amount", ""));
  const [date, setDate] = useState(get(defaultValue, "date", ""));
  let year = !isEmpty(defaultValue) ? defaultValue.date.slice(0, 4) : "";
  let month = !isEmpty(defaultValue) ? defaultValue.date.slice(4, 6) : "";
  let day = !isEmpty(defaultValue) ? defaultValue.date.slice(6, 8) : "";
  const [value, onChange] = useState(
    isEmpty(defaultValue) ? new Date() : new Date(year, month - 1, day)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateOpen = () => {
    setCalendarOpen(true);
  };

  useEffect(() => {
    const formatDate = `${value.getFullYear()}${
      value.getMonth() + 1 < 10
        ? `0${value.getMonth() + 1}`
        : value.getMonth() + 1
    }${value.getDate() < 10 ? `0${value.getDate()}` : value.getDate()}`;
    setDate(formatDate);
    setCalendarOpen(false);
  }, [value]);

  const handleAmountChange = (event) => {
    setErrorMessage("");
    const regExp = /^[0-9]+$/;
    if (!isEmpty(event.target.value) && regExp.test(event.target.value)) {
      setAmount(event.target.value);
    }
  };
  const handleNameChange = (event) => {
    setErrorMessage("");
    setName(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setErrorMessage("");
    setCategory(event.target.value);
  };

  const handleRadioChange = (event) => {
    setErrorMessage("");
    setSelectedValue(event.target.value);
  };

  const onSubmit = async (e) => {
    if (
      isEmpty(amount) ||
      isEmpty(name) ||
      isEmpty(date) ||
      isEmpty(category)
    ) {
      setErrorMessage("請輸入完整內容");
      return;
    }
    e.preventDefault();
    try {
      selectedValue === "Spending"
        ? await addDoc(collection(fs, "Spending"), {
            amount,
            name,
            date,
            category,
            userId,
          })
        : await addDoc(collection(fs, "Income"), {
            amount,
            name,
            date,
            category,
            userId,
          });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setDate("");
    setName("");
    setAmount("");
    setCategory("");
    handleClose();
  };
  const handleEdit = async () => {
    await updateDoc(doc(fs, type, id), {
      amount: amount.toString(),
      name,
      date,
      category,
      userId: get(defaultValue, "userId", ""),
    });
    handleClose();
  };
  // const toggleComplete = async (todo) => {
  //   await updateDoc(doc(db, "todos", todo.id), { completed: !todo.completed });
  // };
  return (
    <div className="modal">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <div>
            <Radio
              checked={selectedValue === "Spending"}
              onChange={handleRadioChange}
              value="Spending"
              name="radio-buttons"
            />
            Spending
          </div>
          <Radio
            checked={selectedValue === "Income"}
            onChange={handleRadioChange}
            value="Income"
            name="radio-buttons"
          />
          Income
          <TextField
            sx={{ display: "inline-block", marginBottom: "10px" }}
            fullWidth
            id="standard"
            label="Name"
            variant="standard"
            onChange={handleNameChange}
            value={name}
            color={theme.primary}
          />
          <TextField
            sx={{ display: "inline-block", marginBottom: "10px" }}
            fullWidth
            id="standard-basic"
            label="Amount"
            variant="standard"
            onChange={handleAmountChange}
            value={amount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <TextField
            sx={{ display: "inline-block", marginBottom: "10px" }}
            fullWidth
            id="standard-bas"
            label="Date"
            variant="standard"
            onClick={handleDateOpen}
            value={date}
          />
          {calendarOpen && (
            <Calendar onChange={onChange} value={value} className="calendar" />
          )}
          <Typography id="description" sx={{ fontSize: "8px" }}>
            Category
          </Typography>
          <Select
            value={category}
            variant="standard"
            sx={{ width: 120, zIndex: "100" }}
            onChange={handleCategoryChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {selectedValue === "Spending"
              ? SPEND_OPTIONS.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.name}
                  </MenuItem>
                ))
              : INCOME_OPTIONS.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
          </Select>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, color: "#c89ea0", fontSize: "8px" }}
          >
            ---
            {isEmpty(errorMessage) ? "開源節流" : errorMessage}
            ---
          </Typography>
          <div>
            <Button
              variant="outlined"
              size="large"
              onClick={title === "ADD" ? onSubmit : handleEdit}
              endIcon={<SendIcon />}
              sx={{
                zIndex: "100",
              }}
            >
              SEND
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
