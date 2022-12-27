import React, { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Button,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { isEmpty, get } from "lodash";
import PropTypes from "prop-types";
import SendIcon from "@mui/icons-material/Send";
import { fs } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { SPEND_OPTIONS, INCOME_OPTIONS } from "../utils/const";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "1px solid #767676",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const { handleClose, open, theme, title, defaultValue } = props;
  console.log(defaultValue);
  const defaultAmount = get(defaultValue, "amount", "");
  const defaultCate = get(defaultValue, "category", "");
  const defaultDate = get(defaultValue, "date", "");
  const defaultName = get(defaultValue, "name", "");
  const [name, setName] = useState("");
  const [amount, setamount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("please select");
  const [tab, setTab] = useState("1");
  const handleamountChange = (event) => {
    setamount(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      tab === 1
        ? await addDoc(collection(fs, "Spending"), {
            amount,
            name,
            date,
            category,
          })
        : await addDoc(collection(fs, "Income"), {
            amount,
            name,
            date,
            category,
          });
      console.log("sucess");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setDate("");
    setName("");
    setamount(0);
    setCategory("please select");
    handleClose();
  };
  return (
    <div className="modal">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              {/* <Tabs onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Spending" value="1" />
                <Tab label="Income" value="2" />
              </Tabs> */}
            </Box>
          </Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <TextField
            className="input"
            fullWidth
            id="standard"
            label="Name"
            variant="standard"
            onChange={handleNameChange}
            value={name}
            color={theme.primary}
            defaultValue={defaultName}
          />
          <TextField
            className="input"
            fullWidth
            id="standard-basic"
            label="Amount"
            variant="standard"
            onChange={handleamountChange}
            value={amount}
            defaultValue={defaultAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <TextField
            className="input"
            fullWidth
            id="standard-bas"
            label="Date"
            variant="standard"
            onChange={handleDateChange}
            value={date}
            defaultValue={defaultDate}
          />
          <div className="selectSend">
            <Select
              className="selectSend"
              value={category}
              defaultValue={defaultCate}
              variant="standard"
              sx={{ width: 120 }}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {tab === 1
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
            <Button
              className="selectSend"
              variant="outlined"
              size="large"
              onClick={onSubmit}
              endIcon={<SendIcon />}
            >
              SEND
            </Button>
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ---開源節流---
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
