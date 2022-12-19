import "./index.css";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Grid, TextField, InputAdornment } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import BasicModal from "./component/Modal";
import Chart from "./component/Chart";
import SpendingList from "./component/SpendingList";
import SearchIcon from "@mui/icons-material/Search";

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
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header>
          <div className="logo">Need Day Remember</div>
        </header>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className="leftPart">
            <div className="searchAdd-area">
              <TextField
                id="standard"
                variant="standard"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleOpen}
                variant="outlined"
                size="large"
                className="btn-add"
              >
                Add New
              </Button>
            </div>
            <div className="spendingList">
              <SpendingList theme={theme} open={open} />
            </div>
          </Grid>
          <Grid item xs={12} md={8} className="rightPart">
            <Chart />
          </Grid>
        </Grid>
        <BasicModal
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          theme={theme}
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
