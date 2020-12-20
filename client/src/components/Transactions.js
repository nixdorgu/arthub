import React, { useEffect, useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Tabs, Tab } from "@material-ui/core";
import Facade from "../utils/Facade";
import LoadingIndicator from "./LoadingIndicator";
import NoTransactions from "./states/NoTransactions";

import PropTypes from "prop-types";
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
      {value === index && <Box p={3}>{children}</Box>}
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

export default function Transactions() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(0);

  const OPTIONS = [
    "Pending",
    "Payment Pending",
    "Cancelled",
    "Ongoing",
    "Completed",
  ];

  const updateData = useCallback(() => {
    new Facade().get(
      `/api/transactions/${user.id}`,
      (success) => {
        setData(success.data);
        setTimeout(() => updateData(), 10000);
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

    return () => {
      clearTimeout(updateData);
    };
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
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { background: "#FF5678" } }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Transaction tabs"
          >
            {OPTIONS.map((option, index) => (
              <Tab
                key={index}
                label={option}
                style={{ fontFamily: "Montserrat, sans-serif" }}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          {OPTIONS.map((option, index) => (
            <TabPanel value={value} index={index}>
              {data
                .filter((t) => t.status === option.toLowerCase())
                .map((transaction, index) => (
                  <TransactionCard key={index} props={{ transaction, user }} />
                ))}
            </TabPanel>
          ))}
        </div>
      )}
    </div>
  );
}

// TODO: WORK ON PROFILE SO THE LOGIC OF HOW TRANSACTIONS HAPPEN CAN LINK TO THIS
