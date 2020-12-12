import React, { useEffect, useCallback, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Tabs, Tab} from "@material-ui/core";
import Facade from "../utils/Facade";
import LoadingIndicator from "./LoadingIndicator";
import NoTransactions from "./states/NoTransactions";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TransactionCard from "./TransactionCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(0);

  const updateData = useCallback(() => {
    new Facade().get(
      `/api/transactions/${user.id}`,
      (success) => {
        setData(success.data);
        setTimeout(() => updateData, 10_000);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTransactions = useCallback(() => {
    setLoading(true);

    new Facade().get(
      `/api/transactions/${user.id}`,
      (success) => {
        setError(null);

        console.log(success.data);
        setData(success.data);
        setLoading(false);
        updateData();
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  }, [user, updateData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, updateData, error]);
  return (
    <div>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        error
      ) : data.length === 0 ? (
        <NoTransactions />
      ) : (
        <div>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Pending" {...a11yProps(0)} />
            <Tab label="Payment Pending" {...a11yProps(1)} />
            <Tab label="Cancelled" {...a11yProps(2)} />
            <Tab label="Accepted" {...a11yProps(3)} />
            <Tab label="Completed" {...a11yProps(4)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            {data.filter((t) => t.status === "pending").map((transaction, index) => <TransactionCard key={index} props={{transaction, user}}/>)}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {data.filter((t) => t.status === "payment_pending").map((transaction, index) => <TransactionCard key={index} props={{transaction, user}}/>)}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {data.filter((t) => t.status === "cancelled").map((transaction, index) => <TransactionCard key={index} props={{transaction, user}}/>)}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {data.filter((t) => t.status === "accepted").map((transaction, index) => <TransactionCard key={index} props={{transaction, user}}/>)}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {data.filter((t) => t.status === "completed").map((transaction, index) => <TransactionCard key={index} props={{transaction, user}}/>)}
          </TabPanel>
        </div>
      )}
    </div>
  );
}

// TODO: WORK ON PROFILE SO THE LOGIC OF HOW TRANSACTIONS HAPPEN CAN LINK TO THIS
