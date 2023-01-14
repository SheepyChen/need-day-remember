import React, { useState, useEffect, Fragment } from "react";
import { fs } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  List,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import Chart from "./Chart";
import SearchIcon from "@mui/icons-material/Search";
import SpendingItem from "./SpendingItem";
import AddModal from "./AddModal";
import { isEmpty } from "lodash";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function SpendingList(props) {
  const { theme, cookies } = props;
  const [spendingData, setSpendingData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [defaultYearMonth, setDefaultYearMonth] = useState(
    moment().format("YYYYMM")
  );
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
        newSpendingData.filter((item) => item.userId === cookies.loginToken)
      );
      // console.log(newSpendingData, userData.uid);
    });
    await getDocs(collection(fs, "Income")).then((querySnapshot) => {
      const newIncomeData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIncomeData(
        newIncomeData.filter((item) => item.userId === cookies.loginToken)
      );
      // console.log(spendingData, newIncomeData);
    });
  };

  const handleMonthAdd = () => {
    setDefaultYearMonth(
      moment(defaultYearMonth).add(1, "months").format("YYYYMM")
    );
  };
  const handleMonthSubtract = () => {
    setDefaultYearMonth(
      moment(defaultYearMonth).subtract(1, "months").format("YYYYMM")
    );
  };
  useEffect(() => {
    fetchPost();
  }, [open]);
  //整理圖表需要的資料

  const amountList = spendingData.map((item) => {
    return {
      ...item,
      amount: parseInt(item.amount),
      yearMonth: !isEmpty(item) ? item.date.slice(0, 6) : "",
    };
  });
  const defautYearMonthAmountList = amountList.filter(
    (item) => item.yearMonth === defaultYearMonth
  );
  const amountListSum = {};
  for (let i = 0; i < defautYearMonthAmountList.length; i++) {
    const obj = defautYearMonthAmountList[i];
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
  const incomeList = incomeData.map((item) => {
    return {
      ...item,
      amount: parseInt(item.amount),
      yearMonth: !isEmpty(item) ? item.date.slice(0, 6) : "",
    };
  });
  const defautYearMonthIncomeList = incomeList.filter(
    (item) => item.yearMonth === defaultYearMonth
  );
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
    <Fragment>
      <Typography
        id="title-description"
        sx={{
          mt: 2,
          fontSize: "24px",
          fontWeight: "700",
          color: "#ab4f4f",
          borderBottom: "1px dashed #c89ea0",
        }}
      >
        <IconButton color="primary">
          <ChevronLeftIcon onClick={handleMonthSubtract} />
        </IconButton>
        {defaultYearMonth}
        <IconButton color="primary">
          <ChevronRightIcon onClick={handleMonthAdd} />
        </IconButton>
      </Typography>

      <Grid container spacing={2}>
        <AddModal
          handleClose={handleClose}
          open={open}
          theme={theme}
          title="ADD"
          userId={cookies.loginToken}
        />

        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            {/* <TextField
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
          /> */}
            <Button
              onClick={handleOpen}
              variant="outlined"
              size="small"
              sx={{ fontSize: "20px", margin: "30px" }}
            >
              Add New
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6} className="spendingListPart">
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, fontSize: "20px", fontWeight: "700" }}
              >
                Spending List
              </Typography>
              {isEmpty(defautYearMonthAmountList) ? (
                <div>Sorry you don't have any spending data this month...</div>
              ) : (
                <Box
                  sx={{
                    border: "1px solid #802d2d",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 500,
                      bgcolor: "background.paper",
                    }}
                  >
                    {defautYearMonthAmountList.map((spending) => (
                      <SpendingItem
                        fetchPost={fetchPost}
                        key={spending.id}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        open={open}
                        theme={theme}
                        data={spending}
                        type="Spending"
                      />
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6} className="incomeListPart">
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, fontSize: "20px", fontWeight: "700" }}
              >
                Income List
              </Typography>
              {isEmpty(defautYearMonthIncomeList) ? (
                <div>Sorry you don't have any income data this month...</div>
              ) : (
                <Box
                  sx={{
                    border: "1px solid #802d2d",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 500,
                      bgcolor: "background.paper",
                    }}
                  >
                    {defautYearMonthIncomeList.map((income) => (
                      <SpendingItem
                        fetchPost={fetchPost}
                        key={income.id}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        open={open}
                        theme={theme}
                        data={income}
                        type="Income"
                      />
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} className="rightPart">
          <Chart
            categorySums={amountListSum}
            spendingTotalPerMonth={spendingTotalPerMonth}
            incomeTotalPerMonth={incomeTotalPerMonth}
            defaultYearMonth={defaultYearMonth}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
