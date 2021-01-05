import React, { useEffect, useRef, useState } from 'react'
import { fetch } from '../utils/Facade';

export default function PayPal(props) {
    const {transaction} = props.props;
    const paypal = useRef();
    const [count, setCount] = useState(0);


    useEffect(() => {
        const order = {
            description: transaction.title,
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
                    console.log(`Successful order: ${order}`)

                    fetch(`api/transactions/${transaction.transaction_id}`, {
                        method: "PATCH",
                        data: {classification: "ongoing"},
                        success: (success) => {
                            alert(JSON.stringify(data))
                        },
                        error: (error) => {
                            alert(JSON.stringify(error.message))
                        }   
                    });
                },
                onError: (error) => {
                    console.log(error)
                    // display snackbar
                }
            }).render(paypal.current);

            setCount(prev => prev + 1);
        }
    }, [count, transaction]);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}