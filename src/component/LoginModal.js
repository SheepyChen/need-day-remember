import React, { useEffect, useState } from "react";
import { fs, auth } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Modal, Box, TextField, Button } from "@mui/material";

export default function LoginModal(props) {
  const { open, handleClose, setUserData } = props;
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [choice, setChoice] = useState("login");

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

  useEffect(() => {
    setChoice("login");
  }, [open]);
  const onSubmit = async (email, password) => {
    if (choice === "register") {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(fs, "users"), {
          uid: user.uid,
          name: email,
          authProvider: "local",
          email,
        });
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
    if (choice === "login") {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUserData(res.user);
    }
    setAccount("");
    setPwd("");
    handleClose();
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <h3>{choice === "login" ? "登入" : "註冊"}</h3>
        <TextField
          className="input"
          fullWidth
          id="standard-account"
          label="Account"
          variant="standard"
          onChange={(e) => setAccount(e.target.value)}
          value={account}
        />
        <TextField
          className="input"
          fullWidth
          id="standard-pwd"
          label="Password"
          variant="standard"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
        />
        <Button
          className="selectSend"
          variant="outlined"
          size="large"
          onClick={(e) => {
            e.preventDefault();
            onSubmit(account, pwd);
          }}
        >
          SEND
        </Button>
        <a
          onClick={() => {
            setChoice("register");
          }}
        >
          還沒有註冊過？請按此註冊
        </a>
        {/* <a
          onClick={() => {
            sendPasswordReset();
          }}
        >
          忘記密碼？請點此重設
        </a> */}
      </Box>
    </Modal>
  );
}
