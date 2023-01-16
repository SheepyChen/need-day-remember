import "./index.css";
import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginModal from "./component/LoginModal";
import SpendingList from "./component/SpendingList";
import { signOut } from "firebase/auth";
import { fs, auth } from "../src/utils/firebase";
import { isEmpty } from "lodash";
import { useCookies, withCookies } from "react-cookie";

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

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    signOut(auth);
    setUserData({});
    removeCookie(
      "loginToken"
      //本機使用
      //  {
      //   path: "/",
      //   domain: "localhost",
      // }
    );
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
            <Box
              sx={{
                bgcolor: "rgb(255, 255, 255)",
                color: "rgb(32, 55, 56)",
                position: "absolute",
                top: "4px",
                left: "64px",
                width: "100px",
                height: "100px",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Need Day Remember
            </Box>
            {/* <Button size="small" onClick={handleOpen}>
              {" "}
              Diary{" "}
            </Button> */}
            <Button
              size="large"
              onClick={!isEmpty(cookies.loginToken) ? handleLogout : handleOpen}
              sx={{
                bgcolor: "rgb(200, 158, 160)",
                color: "#0f0f0f",
                marginTop: "30px",
                position: "absolute",
                top: "0%",
                right: "16%",
              }}
            >
              {" "}
              {!isEmpty(cookies.loginToken) ? "LOGOUT" : "LOGIN"}{" "}
            </Button>
          </Box>
        </header>

        <LoginModal
          open={open}
          handleClose={handleClose}
          setUserData={setUserData}
          setCookie={setCookie}
        />
        {!isEmpty(cookies.loginToken) ? (
          <SpendingList theme={theme} cookies={cookies} />
        ) : (
          <Box
            sx={{
              color: "#0f0f0f",
              height: "20px",
            }}
          >
            ...
          </Box>
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

export default withCookies(App);
