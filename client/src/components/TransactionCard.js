import React from "react";

export default function TransactionCard(props) {
  const { transaction, user } = props.props;
  
  return (
    <div
      key={transaction.transaction_id}
      style={{
        boxShadow: "1px 0px 5px 2px #ccc",
        padding: "1rem",
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
          <a href={`profile/${transaction.artist_id}`}>
            Commissioned to {transaction.artist_name}
          </a>
        ) : (
          <a href={`profile/${transaction.user_id}`}>
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
  );
}
