import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Grid, TextField, Button } from "@mui/material";
import { Fragment } from "react";
import { get } from "lodash";
import { Box } from "@mui/system";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const categoryOptions = {
  responsive: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "本月各類別支出統計表",
    },
  },
};

export const yearOptions = {
  responsive: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "今年收支統計表",
    },
  },
};

const labels = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export default function Chart(props) {
  const { defaultYearMonth } = props;
  const defaultYear = defaultYearMonth.slice(0, 4);
  const categorySums = get(props, "categorySums", {});
  const spendingTotalPerMonth = get(props, "spendingTotalPerMonth", {});
  const incomeTotalPerMonth = get(props, "incomeTotalPerMonth", {});
  const categorySumsValue = Object.values(categorySums);
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
  const label = Object.keys(categorySums).map(
    (item) => SORT_OPTIONS.find((i) => i.value === item).name
  );

  const monthSpendingDataArr = [];
  for (let i = 1; i < 12; i++) {
    i < 10
      ? monthSpendingDataArr.push(
          get(spendingTotalPerMonth, `${defaultYear}0${i}`, 0)
        )
      : monthSpendingDataArr.push(
          get(spendingTotalPerMonth, `${defaultYear}${i}`, 0)
        );
  }

  const monthIncomeDataArr = [];
  for (let i = 1; i < 12; i++) {
    i < 10
      ? monthIncomeDataArr.push(
          get(incomeTotalPerMonth, `${defaultYear}0${i}`, 0)
        )
      : monthIncomeDataArr.push(
          get(incomeTotalPerMonth, `${defaultYear}${i}`, 0)
        );
  }

  // console.log(monthIncomeDataArr, monthSpendingDataArr);
  const dateData = {
    labels,
    datasets: [
      {
        label: "收入",
        data: monthIncomeDataArr,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "支出",
        data: monthSpendingDataArr,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const categoryData = {
    labels: label,
    datasets: [
      {
        label: "總花費",
        data: categorySumsValue,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Fragment>
      {/* <div className="searchAdd-area">
        <TextField
          id="standard"
          label="From:"
          variant="standard"
          placeholder="20221201"
          size="medium"
        />
        <TextField
          id="standard-basic"
          label="To:"
          variant="standard"
          placeholder="20221230"
          size="medium"
        />
        <Button
         
          size="large"
          variant="outlined"
          // onClick={onSubmit}
        >
          go
        </Button>
      </div> */}

      <Grid container spacing={0} sx={{ marginLeft: "40px" }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ marginBottom: "30px" }}>
            <Pie options={categoryOptions} data={categoryData} height={350} />
          </Box>
          <Box sx={{ marginBottom: "30px" }}>
            <Bar options={yearOptions} data={dateData} height={380} />
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ paddingLeft: "10px" }}></Grid>
      </Grid>
    </Fragment>
  );
}
