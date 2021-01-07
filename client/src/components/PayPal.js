import React, { useEffect, useRef, useState } from 'react'

export default function PayPal(props) {
    const { transaction, handleSubmit } = props.props;
    const paypal = useRef();
    const [count, setCount] = useState(0);


    useEffect(() => {
        const order = {
            description: transaction.transaction_id,
            amount: {
                currency_code: "USD",
                value: transaction.price
            } 
        }

        if (count === 0) {
            window.paypal.Buttons({
                createOrder: (data, actions, error) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{...order}]
                    })
                },
                onApprove: async(data, actions) => {
                    const order = await actions.order.capture();
                    return handleSubmit(true);
                },
                onError: (error) => {
                    return handleSubmit(false);
                }
            }).render(paypal.current);

            setCount(prev => prev + 1);
        }
    }, [count, transaction, handleSubmit]);

    return <div ref={paypal}></div>;
}