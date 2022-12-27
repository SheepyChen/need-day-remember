import React, { useState, useEffect } from "react";
import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { List, Button, Grid, TextField, InputAdornment } from "@mui/material";
import Chart from "./Chart";
import SearchIcon from "@mui/icons-material/Search";
import SpendingItem from "./SpendingItem";
export default function SpendingList(props) {
  const { open, handleOpen, handleClose, theme } = props;
  const [spendingData, setSpendingData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(fs, "Spending")).then((querySnapshot) => {
      const newSpendingData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSpendingData(newSpendingData);
      // console.log(spendingData, newSpendingData);
    });
    await getDocs(collection(fs, "Income")).then((querySnapshot) => {
      const newIncomeData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIncomeData(newIncomeData);
      // console.log(spendingData, newIncomeData);
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
  // console.log(sums);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8} className="leftPart">
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} className="spendingListPart">
            <div className="spendingList">
              <List
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  bgcolor: "background.paper",
                }}
              >
                {spendingData.map((spending) => (
                  <SpendingItem
                    key={spending.id}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    open={open}
                    theme={theme}
                    data={spending}
                    type="spending"
                  />
                ))}
              </List>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className="incomeListPart">
            <div className="spendingList">
              <List
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  bgcolor: "background.paper",
                }}
              >
                {incomeData.map((spending) => (
                  <SpendingItem
                    key={spending.id}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    open={open}
                    theme={theme}
                    data={spending}
                    type="income"
                  />
                ))}
              </List>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4} className="rightPart">
        <Chart categorySums={sums} />
      </Grid>
    </Grid>
  );
}
