import "./index.css";
import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginModal from "./component/LoginModal";
import SpendingList from "./component/SpendingList";
import { signOut } from "firebase/auth";
import { fs, auth } from "../src/utils/firebase";
import { isEmpty } from "lodash";

const theme = createTheme({
  typography: {
    fontFamily: ["-apple-system", "serif"].join(","),
  },
  palette: {
    primary: {
      main: "#c89ea0",
    },
    secondary: {
      main: "#ab4f4f",
    },
  },
});

export default function App() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    signOut(auth);
    setUserData({});
  };
  // console.log(userData);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header>
          <Box
            sx={{
              bgcolor: "rgb(200, 158, 160)",
              width: "100%",
              height: "17vh",
            }}
          >
            <div className="logo">Need Day Remember</div>
            {/* <Button size="small" onClick={handleOpen}>
              {" "}
              Diary{" "}
            </Button> */}
          </Box>
        </header>
        <Button
          size="large"
          onClick={!isEmpty(userData) ? handleLogout : handleOpen}
          sx={{
            bgcolor: "rgb(200, 158, 160)",
            color: "rgb(0, 0, 0)",
            marginTop: "30px",
          }}
        >
          {" "}
          {!isEmpty(userData) ? "LOGOUT" : "LOGIN"}{" "}
        </Button>
        <LoginModal
          open={open}
          handleClose={handleClose}
          setUserData={setUserData}
        />
        {!isEmpty(userData) && (
          <SpendingList theme={theme} userData={userData} />
        )}
        <footer>
          <div class="container">
            <p>© 2022 Need Day Remember. All Rights Reserved.</p>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
