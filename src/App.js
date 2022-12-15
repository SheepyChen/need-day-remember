import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { fs } from "../src/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [amout, setAmout] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("食");
  const handleAmoutChange = (event) => {
    setAmout(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const documentRef = await addDoc(collection(fs, "Spending"), {
        amout,
        name,
        date,
      });
      console.log("sucess");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setDate("");
    setName("");
    setAmout(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <TextField
          id="standard-basic"
          label="Amout"
          variant="filled"
          onChange={handleAmoutChange}
          value={amout}
        />
        <TextField
          id="standard"
          label="Name"
          variant="filled"
          onChange={handleNameChange}
          value={name}
        />
        <TextField
          id="standard-bas"
          label="Date"
          variant="filled"
          onChange={handleDateChange}
          value={date}
        />
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </header>
    </div>
  );
}

export default App;
