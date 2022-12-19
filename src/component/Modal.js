import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { fs } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const { handleClose, open, theme } = props;
  const SORT_OPTIONS = [
    { value: "food", name: "食" },
    { value: "clothes", name: "衣" },
    { value: "living", name: "住" },
    { value: "transportation", name: "行" },
    { value: "learning", name: "育" },
    { value: "entertainment", name: "樂" },
    { value: "medicine", name: "醫" },
    { value: "luxury", name: "奢" },
  ];
  const [amount, setamount] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("food");
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
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const documentRef = await addDoc(collection(fs, "Spending"), {
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
    setCategory("food");
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New
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
          />
          <TextField
            className="input"
            fullWidth
            id="standard-basic"
            label="Amount"
            variant="standard"
            onChange={handleamountChange}
            value={amount}
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
          />
          <div className="selectSend">
            <Select
              className="selectSend"
              value={category}
              variant="standard"
              sx={{ width: 120 }}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {SORT_OPTIONS.map((item) => (
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
