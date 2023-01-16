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
  const colorGenerate = (cate) => {
    let color = "#cee0d3";
    switch (cate) {
      case "entertainment":
        return (color = "rgba(54, 162, 235, 0.2)");
      case "clothes":
        return (color = "rgba(221, 240, 185, 0.4)");
      case "living":
        return (color = "rgba(153, 102, 255, 0.2)");
      case "transportation":
        return (color = "rgba(255, 99, 132, 0.2)");
      case "learning":
        return (color = "rgba(75, 192, 192, 0.2)");
      case "food":
        return (color = "rgba(255, 159, 64, 0.2)");
      case "luxury":
        return (color = "rgba(185, 186, 184, 0.2)");
      case "medicine":
        return (color = "rgba(255, 206, 86, 0.2)");
      default:
        return (color = "#f0f5f2");
    }
  };

  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: colorGenerate(data.category),
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
