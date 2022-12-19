import React, { useState, useEffect, Fragment } from "react";
import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

// const totalamount=
// 算出total 再分比例
// modal.js
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import Divider from "@mui/material/Divider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
export default function SpendingList(props) {
  const { open } = props;
  const [spendingData, setSpendingData] = useState([]);
  const SORT_OPTIONS = [
    { value: "food", name: "食" },
    { value: "clothes", name: "衣" },
    { value: "living", name: "住" },
    { value: "transportation", name: "行" },
    { value: "learning", name: "育" },
    { value: "entertainment", name: "樂" },
    { value: "medicine", name: "醫" },
    { value: "luxury", name: "奢" },
  ];
  const fetchPost = async () => {
    await getDocs(collection(fs, "Spending")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSpendingData(newData);
      console.log(spendingData, newData);
    });
  };

  useEffect(() => {
    fetchPost();
  }, [open]);

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 500,
        bgcolor: "background.paper",
      }}
    >
      {spendingData.map((spending) => (
        <Fragment key={spending.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                {
                  SORT_OPTIONS.find((item) => item.value === spending.category)
                    .name
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={spending.name} secondary={spending.date} />$
            {spending.amount}
            <EditIcon color="primary" />
            <DeleteOutlineIcon color="primary" />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>
      ))}
    </List>
  );
}
