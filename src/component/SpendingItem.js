import React, { useState, useEffect, Fragment } from "react";
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
import BasicModal from "./AddModal";
export default function SpendingItem(props) {
  const { data, theme, type , fetchPost } = props;
  const [open, setOpen] = useState(false);
  const handleEditOpen = () => setOpen(true);
  const handleEditClose = () => setOpen(false);
    const handleDelete = async (id) => {
      try{
      type === "spending"?
     await deleteDoc(doc(fs, "Spending", id)):  await deleteDoc(doc(fs, "Income", id))
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    fetchPost ()
    }
  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            {type === "spending"
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
          <BasicModal
            handleOpen={handleEditOpen}
            handleClose={handleEditClose}
            open={open}
            theme={theme}
            defaultValue={data}
          />
        )}
        <IconButton color="primary">
          <DeleteOutlineIcon onClick={()=>handleDelete(data.id)}/>
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </Fragment>
  );
}
