import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
                    console.log(line + " : " + typeof response[line]);
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

            console.log(Object.entries(properties).map((entry) => {
                return <tr key={entry[0]}><td>{entry[0]}</td><td>{entry[1]}</td></tr>
            }));
        }
        if ( params.transactionHash ) {
            fetchData();
        }
    }, [alchemy, params.transactionHash]);

    return (
        <div className="container">
            <h2>Transaction {params.transactionHash}</h2>
            <div className="my-3" style={{ textAlign: 'left' }}>
                {Object.entries(transactionData).map((entry) => {
                    return <div className='row py-2 border-bottom'><div className='col-3'>{entry[0]}</div><div className='col-9' style={{ wordWrap: 'break-word' }}>{entry[1]}</div></div>
                })}
            </div>
        </div>
    );
}

export default Transaction;