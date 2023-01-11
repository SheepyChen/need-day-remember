import React, { useState, useEffect } from "react";
import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { List, Button, Grid, TextField, InputAdornment } from "@mui/material";
import Chart from "./Chart";
import SearchIcon from "@mui/icons-material/Search";
import SpendingItem from "./SpendingItem";
import AddModal from "./AddModal";
import { isEmpty } from "lodash";

export default function SpendingList(props) {
  const { theme, userData } = props;
  const [spendingData, setSpendingData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchPost = async () => {
    await getDocs(collection(fs, "Spending")).then((querySnapshot) => {
      const newSpendingData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setSpendingData(
        newSpendingData.filter((item) => item.userId === userData.uid)
      );
      // console.log(newSpendingData, userData.uid);
    });
    await getDocs(collection(fs, "Income")).then((querySnapshot) => {
      const newIncomeData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIncomeData(
        newIncomeData.filter((item) => item.userId === userData.uid)
      );
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
      yearMonth: !isEmpty(item) ? item.date.slice(0, 6) : "",
    };
  });

  const incomeList = incomeData.map((item) => {
    return {
      ...item,
      amount: parseInt(item.amount),
      yearMonth: !isEmpty(item) ? item.date.slice(0, 6) : "",
    };
  });

  const amountListSum = {};
  for (let i = 0; i < amountList.length; i++) {
    const obj = amountList[i];
    const { category, amount } = obj;
    if (category in amountListSum) {
      amountListSum[category] += amount;
    } else {
      amountListSum[category] = amount;
    }
  }
  const spendingTotalPerMonth = {};
  for (let i = 0; i < amountList.length; i++) {
    const obj = amountList[i];
    const { yearMonth, amount } = obj;
    if (yearMonth in spendingTotalPerMonth) {
      spendingTotalPerMonth[yearMonth] += amount;
    } else {
      spendingTotalPerMonth[yearMonth] = amount;
    }
  }
  const incomeTotalPerMonth = {};
  for (let i = 0; i < incomeList.length; i++) {
    const obj = incomeList[i];
    const { yearMonth, amount } = obj;
    if (yearMonth in incomeTotalPerMonth) {
      incomeTotalPerMonth[yearMonth] += amount;
    } else {
      incomeTotalPerMonth[yearMonth] = amount;
    }
  }

  return (
    <Grid container spacing={2}>
      <AddModal
        handleClose={handleClose}
        open={open}
        theme={theme}
        title="ADD"
        userData={userData}
      />
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
            {isEmpty(spendingData) ? (
              <div>sorry you dont have any spending data...</div>
            ) : (
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
                      fetchPost={fetchPost}
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
            )}
          </Grid>
          <Grid item xs={12} md={6} className="incomeListPart">
            {isEmpty(incomeData) ? (
              <div>sorry you dont have any income data...</div>
            ) : (
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
                      fetchPost={fetchPost}
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
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4} className="rightPart">
        <Chart
          categorySums={amountListSum}
          spendingTotalPerMonth={spendingTotalPerMonth}
          incomeTotalPerMonth={incomeTotalPerMonth}
        />
      </Grid>
    </Grid>
  );
}
