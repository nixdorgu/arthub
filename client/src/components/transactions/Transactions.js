import React, { useEffect, useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Tabs, Tab } from "@material-ui/core";
import Facade from "../../utils/Facade";
import LoadingIndicator from "../LoadingIndicator";
import NoTransactions from "../states/NoTransactions";

import TabPanel from "./TabPanel";
import TransactionCard from "./TransactionCard";

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

  let timeout;
  const updateData = useCallback(() => {
    new Facade().get(
      `/api/transactions/${user.id}`,
      (success) => {
        setData(success.data);
        timeout = setTimeout(updateData, 10000);
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
      clearTimeout(timeout);
    };
  }, [fetchTransactions, updateData, error, timeout]);

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
            <TabPanel key={index} value={value} index={index}>
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