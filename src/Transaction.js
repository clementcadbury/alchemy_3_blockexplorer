import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function Transaction({ alchemy }) {
    const [transactionData, setTransactionData] = useState({});

    const params = useParams();
    //const transactionId = params.transactionHash;

    useEffect(() => {
        async function fetchData() {
            let response = await alchemy.core.getTransaction(params.transactionHash);
            //console.log(response);
            const properties = {};
            for (const line in response) {
                //console.log(line);
                if (typeof response[line] !== 'function' && response[line]) {
                    //console.log(line + " : " + typeof response[line]);
                    if (typeof response[line] === 'object') {
                        if (response[line]._hex) {
                            properties[line] = response[line]._hex;
                        }
                        properties[line] = response[line]._hex;
                    } else {
                        properties[line] = response[line];
                    }

                }
            }
            //properties.transactions = response.transactions;

            setTransactionData(properties);

            /*console.log(Object.entries(properties).map((entry) => {
                return <tr key={entry[0]}><td>{entry[0]}</td><td>{entry[1]}</td></tr>
            }));*/
        }
        if (params.transactionHash) {
            fetchData();
        }
    }, [alchemy, params.transactionHash]);

    const makeTransactionsTable = (_transactionData) => {
        return (
            <div className="my-3" style={{ textAlign: 'left' }}>
                {Object.entries(_transactionData).map((entry) => {
                    let text = "";
                    if ( entry[0] === 'blockNumber' || entry[0] === 'blockHash' ){
                        text = <Link to={`/block/${entry[1]}`} >{entry[1]}</Link>;
                    } else if ( entry[0] === 'from' || entry[0] === 'to' ){
                        text = <Link to={`/address/${entry[1]}`} >{entry[1]}</Link>;
                    } else {
                        text = entry[1];
                    }
                    return <div className='row py-2 border-bottom'><div className='col-3'>{entry[0]}</div><div className='col-9' style={{ wordWrap: 'break-word' }}>{text}</div></div>
                })}
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Transaction {params.transactionHash}</h2>
            {makeTransactionsTable(transactionData)}
        </div>
    );
}

export default Transaction;