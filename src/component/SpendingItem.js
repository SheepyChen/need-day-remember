import React, { useState, Fragment } from "react";
import { get } from "lodash";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Chart from "./Chart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { fs } from "../utils/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { SPEND_OPTIONS, INCOME_OPTIONS } from "../utils/const";
import AddModal from "./AddModal";
export default function SpendingItem(props) {
  const { data, theme, type, fetchPost } = props;
  const [open, setOpen] = useState(false);
  const handleEditOpen = () => setOpen(true);
  const handleEditClose = () => {
    setOpen(false);
    fetchPost();
  };
  const handleDelete = async (id) => {
    try {
      type === "Spending"
        ? await deleteDoc(doc(fs, "Spending", id))
        : await deleteDoc(doc(fs, "Income", id));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    fetchPost();
  };
  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: "rgb(224, 195, 197)",
              color: "rgb(71,71, 71)",
            }}
          >
            {type === "Spending"
              ? get(
                  SPEND_OPTIONS.find((item) => item.value === data.category),
                  "name",
                  ""
                )
              : get(
                  INCOME_OPTIONS.find((item) => item.value === data.category),
                  "name",
                  ""
                )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={data.name} secondary={data.date} />${data.amount}
        <IconButton color="primary" onClick={handleEditOpen}>
          <EditIcon />
        </IconButton>
        {open && (
          <AddModal
            handleClose={handleEditClose}
            open={open}
            theme={theme}
            defaultValue={data}
            title="Edit"
            type={type}
          />
        )}
        <IconButton color="primary">
          <DeleteOutlineIcon onClick={() => handleDelete(data.id)} />
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </Fragment>
  );
}
