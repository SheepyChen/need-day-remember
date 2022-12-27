import "./index.css";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BasicModal from "./component/Modal";
import SpendingList from "./component/SpendingList";

const theme = createTheme({
  typography: {
    fontFamily: ["-apple-system", "serif"].join(","),
  },
  palette: {
    primary: {
      main: "#5f9ea0",
    },
    secondary: {
      main: "#426e70",
    },
  },
});

export default function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const def = {};
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header>
          <div className="logo">Need Day Remember</div>
        </header>
        <SpendingList
          theme={theme}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
        <BasicModal
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          theme={theme}
          defaultValue={def}
        />
        <footer>
          <div class="container">
            <p>© 2022 Need Day Remember. All Rights Reserved.</p>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
