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

    const artistCancelPendingTransaction = e.target.className.includes('cancel') && isArtistOfTransaction;
    const artistStatus = artistCancelPendingTransaction ? "cancelled" : "payment pending";
    const artistMessage = artistCancelPendingTransaction ? "The transaction has successfully been cancelled" : "The transaction is now awaiting payment"

    close(e);

    changeStatus(artistStatus, 'cancelled', () => {
      setMessage(isArtistOfTransaction ? artistMessage: "The transaction has successfully been cancelled");

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
      <PendingTransactionModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal && status === "pending"} handleClose={(e) => isArtistOfTransaction ? submit(e, transaction) : close(e)} handleSubmit={(e) => submit(e, transaction)} />
      {status === "payment pending" && !isArtistOfTransaction && showModal && <PaymentPendingModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal && status === "payment pending" && !isArtistOfTransaction} handleClose={close} />}
      {/* {status === "ongoing" && isArtistOfTransaction && showModal && <PaymentPendingModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal} handleClose={close} handleSubmit={(e) => submit(e, transaction)} />} */}
      <Snackbar hidden={showSnackbar} props={{message, undo, snackbarRef, error, showSnackbar, setShowSnackbar}}/>
      <div className="transaction-container" key={transaction.transaction_id} 
        onClick={(e) => {
          if (!e.target.classList?.contains("transaction-link")) {
            setShowModal(true)
          }
        }}
      >
        <h4>{transaction.title}</h4>
        <p className="transaction-subtitle">
          <a className="transaction-link" href={`profile/${!isArtistOfTransaction ? transaction.artist_id : transaction.user_id}`}>
            Commissioned {!isArtistOfTransaction ? 'to' : 'by'} {!isArtistOfTransaction ? transaction.artist_name : transaction.customer_name}
          </a>
        </p>
        <p className="transaction-short-description">{transaction.short_description}</p>
        <div className="transaction-metadata">
          <h5>${transaction.price}</h5>
          <p style={{ fontSize: ".7rem" }}>{transaction.status}</p>
        </div>
      </div>
    </>
  );
}
