import React, { useEffect, useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Tabs, Tab } from "@material-ui/core";
import {fetch} from "../../utils/fetch";
import NoTransactions from "../states/NoTransactions";
import Error500 from "../states/Error500";

import TabPanel from "./TabPanel";
import TransactionCard from "./TransactionCard";
import UserFlow from "../../utils/UserFlow";

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
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
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
    fetch(`/api/transactions/${user.id}`, {
      method: "GET",
      success: (success) => {
        const isEmpty = success.data.length === 0;

        console.log('ups', success)
        setData(success.data);
        setError(isEmpty);
        setEmpty(isEmpty);

        timeout = setTimeout(updateData, 10000);
      },
      error: (error) => {
        setError(true);
        setLoading(false);
      }
    });
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTransactions = useCallback(() => {
    setLoading(true);

    fetch( `/api/transactions/${user.id}`, {
      method: "GET",
      success: (success) => {
        const isEmpty = success.data.length === 0;

        setLoading(false);
        setData(success.data);
        setError(isEmpty);
        setEmpty(isEmpty);

        timeout = setTimeout(updateData, 10000);
      },
      error: (error) => {
        setEmpty(false);
        setError(true);
        setLoading(false);
      }
    });
  }, [user, updateData]);

  useEffect(() => {
    fetchTransactions();

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchTransactions, updateData, error, timeout]);

  return (
    <UserFlow
      isLoading={loading}
      isError={error}
      error={
        empty ? <NoTransactions /> : <Error500/>
      }
      success={
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
      }
    />
  );
}