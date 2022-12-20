import React, { useState, useEffect, Fragment } from "react";
import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
// const totalamount=
// 算出total 再分比例
// modal.js
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
import Chart from "../component/Chart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
export default function SpendingList(props) {
  const { open, handleOpen } = props;
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

  const amountList = spendingData.map((item) => {
    return {
      ...item,
      amount: parseInt(item.amount),
    };
  });
  const sums = {};
  for (let i = 0; i < amountList.length; i++) {
    const obj = amountList[i];
    const { category, amount } = obj;
    if (category in sums) {
      sums[category] += amount;
    } else {
      sums[category] = amount;
    }
  }
  console.log(sums);
  return (
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
                        SORT_OPTIONS.find(
                          (item) => item.value === spending.category
                        ).name
                      }
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={spending.name}
                    secondary={spending.date}
                  />
                  ${spending.amount}
                  <EditIcon color="primary" />
                  <DeleteOutlineIcon color="primary" />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Fragment>
            ))}
          </List>
        </div>
      </Grid>
      <Grid item xs={12} md={8} className="rightPart">
        <Chart categorySums={sums} />
      </Grid>
    </Grid>
  );
}
