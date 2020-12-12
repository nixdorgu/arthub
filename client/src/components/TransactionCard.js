import React, {useState} from "react";
import Facade from "../utils/Facade";
import PendingTransactionModal from "./modals/PendingTransactionModal";
import {isArtist as commissioned} from "../tests/isArtist";

export default function TransactionCard(props) {
  const { transaction, user } = props.props;
  const [showModal, setShowModal] = useState(false);
  const isArtist = commissioned(transaction, user); // wrap into fn + status stuff
  const status = transaction.status;

  const submit = (e, transaction) => {
    setShowModal(false);
    e.preventDefault();

    new Facade().patch(`/api/transactions/${transaction.transaction_id}`, {classification: isArtist? 'payment pending' : 'cancelled'}, (success) => {
      console.log(JSON.stringify(success))

    }, (error) => console.log(JSON.stringify(error)))
  
    
  }

  return (
    <>
    {status === "pending" && showModal && <PendingTransactionModal isArtist={isArtist} transaction={transaction} show={showModal} handleClose={(e) => setShowModal(false)} handleSubmit={(e) => submit(e, transaction)} />}
    {status === "payment pending" && !isArtist && showModal && <PendingTransactionModal isArtist={isArtist} transaction={transaction} show={showModal} handleClose={(e) => setShowModal(false)} handleSubmit={(e) => submit(e, transaction)} />}
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
        {transaction.artist_id !== user.id ? (
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
