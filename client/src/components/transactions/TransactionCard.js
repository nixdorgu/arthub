import React, {useState, useRef } from "react";
import {fetch} from "../../utils/fetch";
import PendingTransactionModal from "../modals/PendingTransactionModal";
import isArtist from "../../tests/isArtist";
import Snackbar from "../Snackbar";
import PaymentPendingModal from "../modals/PaymentPendingModal";
import OngoingTransactionModal from "../modals/OngoingTransactionModal";

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

  const [link, setLink] = useState('');

  const changeStatus = (classificationArtist, classificationUser, onSuccess, onError) => {
    const classification = isArtistOfTransaction? classificationArtist : classificationUser; // use command pattern here
    fetch(`/api/transactions/${transaction.transaction_id}`, {method: "PATCH", data: {classification}, success: onSuccess, error: onError });
  }

  const close = (e) => setShowModal(false);

  const submit = (e, transaction) => {
    e.preventDefault();

    const artistCancelPendingTransaction = e.target.className.includes('cancel') && isArtistOfTransaction;
    const artistStatus = artistCancelPendingTransaction ? "cancelled" : "payment pending";
    const artistMessage = artistCancelPendingTransaction ? "The transaction has successfully been cancelled" : "The transaction is now awaiting payment"

    close();

    changeStatus(artistStatus, 'cancelled', () => {
      setMessage(isArtistOfTransaction ? artistMessage: "The transaction has successfully been cancelled");

      setUndo(() => () => changeStatus('pending', 'pending', () => {
        setMessage("Undo successful.")
        setError(true);
        setShowSnackbar(true);
      }, () => {
        setMessage("Undo unsuccessful.")
        setError(true);
        setShowSnackbar(true);
      }));

      setError(false);
      setShowSnackbar(true);
    }, () => {
      setError(true);
      setMessage(error.message);
      setShowSnackbar(true);
    });
  }

  // Payment Pending
  const handlePaymentCancellation = (e) => {
    e.preventDefault();

    setUndo(null);
    setMessage("");
    setShowSnackbar(false);

    changeStatus('cancelled', 'cancelled', () => {}, () => {});
  }

  const handlePaymentSuccess = (success = true) => {
    close();

    if (success) {
      return fetch(`api/transactions/${transaction.transaction_id}`, {
        method: "PATCH",
        data: {classification: "ongoing"},
        success: (success) => {
          localStorage.removeItem('__paypal_storage__');
          setMessage('Payment successful');
          setError(() => true);
          setShowSnackbar(true);
        },
        error: (error) => {
          localStorage.removeItem('__paypal_storage__');
          setMessage('Payment unsuccessful');
          setError(() => true);
          setShowSnackbar(true);
        }   
      });
    }

    return () => {
      setMessage('Payment unsuccessful');
      setError(() => true)
      setShowSnackbar(true);
    }
  }

  // Ongoing
  const handleLinkSubmit = (e, transaction) => {
    close();
    fetch('/email', {
      method: 'POST',
      data: { link, transaction },
      success: (success) => {
        console.log(success.message)
      },
      error: (error) => {
        console.log(error.message)
      }
    });
  }

  return (
    <>
      <PendingTransactionModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal && status === "pending"} handleClose={close} handleSubmit={(e) => submit(e, transaction)} />
      <PaymentPendingModal isArtist={isArtistOfTransaction} transaction={transaction} show={showModal && status === "payment pending" && !isArtistOfTransaction} handleClose={close} handleCancellation={handlePaymentCancellation} handleSubmit={handlePaymentSuccess} />
      <OngoingTransactionModal show={showModal && status === "ongoing" && isArtistOfTransaction} transaction={transaction} link={link} setLink={setLink} handleClose={close} handleSubmit={(e) => handleLinkSubmit(e, transaction)} />
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
