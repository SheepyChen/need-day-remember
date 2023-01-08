import "./index.css";
import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginModal from "./component/LoginModal";
import SpendingList from "./component/SpendingList";
import { signOut } from "firebase/auth";
import { fs, auth } from "../src/utils/firebase";

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
  const [isLogin, setIsLogin] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    signOut(auth);
    setIsLogin(false);
  };
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
            <Button size="small" onClick={handleOpen}>
              {" "}
              Diary{" "}
            </Button>
            <Button size="small" onClick={isLogin ? handleLogout : handleOpen}>
              {" "}
              {isLogin ? "LOGOUT" : "LOGIN"}{" "}
            </Button>
          </Box>
        </header>

        <LoginModal
          open={open}
          handleClose={handleClose}
          setIsLogin={setIsLogin}
        />
        {isLogin && <SpendingList theme={theme} />}
        <footer>
          <div class="container">
            <p>© 2022 Need Day Remember. All Rights Reserved.</p>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
