import React, {useState, useRef} from "react";
import {fetch} from "../../utils/fetch";
import PendingTransactionModal from "../modals/PendingTransactionModal";
import isArtist from "../../tests/isArtist";
import Snackbar from "../Snackbar";
import PaymentPendingModal from "../modals/PaymentPendingModal";

export default function TransactionCard(props) {
  const { transaction, user } = props.props;
  const [showModal, setShowModal] = useState(false);
  const isArtistOfTransaction = isArtist(transaction, user); // wrap into fn + status stuff
  const status = transaction.status;

  const snackbarRef = useRef();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [undo, setUndo] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const changeStatus = (classificationArtist, classificationUser, onSuccess, onError) => {
    const classification = isArtistOfTransaction? classificationArtist : classificationUser; // use command pattern here
    fetch(`/api/transactions/${transaction.transaction_id}`, {method: "PATCH", data: {classification}, success: onSuccess, error: onError });
  }

  const close = (e) => {
    setShowModal(false);
  }

  const submit = (e, transaction) => {
    e.preventDefault();
    close(e);
    changeStatus('payment pending', 'cancelled', () => {
      setMessage(isArtistOfTransaction ? "The transaction is now awaiting payment": "The transaction has successfully been cancelled");

      setUndo(() => () => changeStatus('pending', 'pending', () => {
        setMessage("Undo successful.")
        setShowSnackbar(true);
        setError(true);
      }, () => {
        setMessage("Undo unsuccessful.")
        setShowSnackbar(true);
        setError(true);
      }));

      setShowSnackbar(true);
      setError(false);
    }, () => {
      setMessage(error.message);
      setShowSnackbar(true);
      setError(!error.success);
    });
  }

  return (
    <>
    {status === "pending" && showModal && <PendingTransactionModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal} handleClose={(e) => close(e)} handleSubmit={(e) => submit(e, transaction)} />}
    {status === "payment pending" && !isArtistOfTransaction && showModal && <PaymentPendingModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal} handleClose={close} />}
    {/* {status === "ongoing" && isArtistOfTransaction && showModal && <PaymentPendingModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal} handleClose={close} handleSubmit={(e) => submit(e, transaction)} />} */}
    {<Snackbar hidden={showSnackbar} props={{message, undo, snackbarRef, error, showSnackbar, setShowSnackbar}}/>}
    <div
      key={transaction.transaction_id}
      style={{
        boxShadow: "1px 0px 5px 2px #ccc",
        padding: "1rem",
        marginBottom: "1rem"
      }}
      onClick={(e) => {
        if (!e.target.classList?.contains("transaction-link")) {
          setShowModal(true)
        }
      }}
    >
      <h4>{transaction.title}</h4>
      <p
        style={{
          lineBreak: "anywhere",
          wordBreak: "break-word",
          fontSize: ".8rem",
          padding: ".5rem 0",
        }}
      >
        {!isArtistOfTransaction ? (
          <a className="transaction-link" href={`profile/${transaction.artist_id}`}>
            Commissioned to {transaction.artist_name}
          </a>
        ) : (
          <a className="transaction-link" href={`profile/${transaction.user_id}`}>
            Commissioned by {transaction.customer_name}
          </a>
        )}
      </p>
      <p
        style={{
          wordBreak: "break-all",
          hyphens: "auto",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          fontSize: ".8rem",
          padding: ".5rem 0",
        }}
      >
        {transaction.short_description}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingTop: ".3rem",
        }}
      >
        <h5>${transaction.price}</h5>
        <p style={{ fontSize: ".7rem" }}>{transaction.status}</p>
      </div>
    </div>
    </>
  );
}
