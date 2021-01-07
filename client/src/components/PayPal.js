import React, { useEffect, useState } from 'react'
import { PayPalButton } from 'react-paypal-button-v2';

export default function PayPal(props) {
    const { transaction, handleSubmit } = props.props;
    const [order, setOrder] = useState({});

    useEffect(() => {
        if (transaction) {
            setOrder({
                description: transaction.transaction_id,
                amount: {
                    currency_code: "USD",
                    value: transaction.price
                } 
            });
        }
    }, [transaction]);

    return (
        <PayPalButton
            createOrder={(data, actions, error) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{...order}]
                })
            }}
            onSuccess={(data, actions) => handleSubmit(true)}
            onError={(error) => handleSubmit(false)}
            catchError={(error) => handleSubmit(false)}
            shippingPreference="NO_SHIPPING"
            options={{
                disableCard: true,
                commit: false,
                component: "",
                clientId: "AcBjUncHHpCLd0grJRL4x80S6boGXGPfhz1R4j_Skg02u66MPRuA8BDFBIEWaCDLdD-7VbkanuTh7SK3"
            } }
        />
    )
}