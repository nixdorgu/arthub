import React, {useEffect, useCallback, useState, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import Facade from '../utils/Facade';
import LoadingIndicator from './LoadingIndicator';
import NoTransactions from './states/NoTransactions';

export default function Transactions() {
    const {user} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateData = useCallback(() => {
        new Facade().get(`/api/transactions/${user.id}`,
            (success) => {
                setData(success.data);
                setTimeout(() => updateData, 10_000)
            },
            (error) => {
                setError(error.message)
                setLoading(false); 
            }
        )
    }, [user]);

    const fetchTransactions = useCallback(() => {
        setLoading(true);

        new Facade().get(`/api/transactions/${user.id}`,
            (success) => {
                setError(null)

                console.log(success.data);
                setData(success.data);
                setLoading(false);
                updateData();
            },
            (error) => {
                setError(error.message)
                setLoading(false);
            }
        )
    }, [user, updateData]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, updateData, error])
    return (
        <div>
            {loading ? <LoadingIndicator/> : (
               error ? (
                error
               ) : (
                    data.length === 0 ? <NoTransactions/> : (
                    data.map((transaction) => {
                        return (
                            <div key={transaction.transaction_id} style={{boxShadow: "1px 0px 5px 2px #ccc", padding: "1rem"}}>
                                <h4>{transaction.title}</h4>
                            <p style={{lineBreak: "anywhere", wordBreak: "break-word", fontSize: ".8rem", padding: ".5rem 0"}}>
                                {transaction.artist_id !== user.id ? (
                                    <a href={`profile/${transaction.artist_id}`}>Commissioned to {transaction.artist_name}</a>
                                ) : (
                                    <a href={`profile/${transaction.user_id}`}>Commissioned by {transaction.customer_name}</a>
                                )}
                            </p>
                                <p style={{wordBreak: "break-all", hyphens:"auto", overflowWrap:"break-word", wordWrap:"break-word", fontSize: ".8rem", padding: ".5rem 0"}}>{transaction.short_description}</p>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: ".3rem"}}>
                                    <h5>${transaction.price}</h5>
                                    <p style={{fontSize: ".7rem"}}>{transaction.status}</p>
                                </div>
                            </div> 
                        );
                    })
                    )
               )
            )}
        </div>
    )
}

// TODO: WORK ON PROFILE SO THE LOGIC OF HOW TRANSACTIONS HAPPEN CAN LINK TO THIS