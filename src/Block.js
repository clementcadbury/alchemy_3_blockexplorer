import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Utils } from 'alchemy-sdk';
import { Link } from "react-router-dom";

function Block({ alchemy }) {
    const [blockData, setBlockData] = useState({});
    const [blockTransactions, setBlockTransactions] = useState([]);

    const params = useParams();
    const blockId = params.blockId ? params.blockId : 'latest';
    const blockIdHex = params.blockId && !Utils.isHexString(params.blockId) ? Utils.hexlify(parseInt(blockId)) : blockId;
    //console.log('blockIdHex : ' + blockIdHex);

    useEffect(() => {
        async function fetchData() {
            let response = await alchemy.core.getBlock(blockIdHex);
            const properties = {};
            for (const line in response) {
                if (line !== 'transactions' && line !== 'length') {
                    if (typeof response[line] === 'object' && response[line]._hex) {
                        properties[line] = response[line]._hex;
                    } else {
                        properties[line] = response[line];
                    }

                }
            }
            //properties.transactions = response.transactions;

            setBlockData(properties);
            setBlockTransactions(response.transactions);

            //console.log(response);
        }
        fetchData();
    }, [alchemy, blockIdHex]);

    const makeBlockDataTable = (_blockData) => {
        return (
            <table className='table table-bordered'>
                <tbody>
                    {Object.entries(_blockData).map((entry) => {
                        let text = "";
                        if ( entry[0] === 'hash' || entry[0] === 'parentHash' || entry[0] === 'number' ){
                            text = <Link to={`/block/${entry[1]}`} >{entry[1]}</Link>;
                        } else if ( entry[0] === 'miner' ){
                            text = <Link to={`/address/${entry[1]}`} >{entry[1]}</Link>;
                        } else {
                            text = entry[1];
                        }
                        return <tr key={entry[0]}><td>{entry[0]}</td><td>{text}</td></tr>
                    })}
                </tbody>
            </table>
        );
    };


    return (
        <div>
            <h2>Block {blockId}</h2>
            <div className="row my-3" style={{ textAlign: 'left' }}>
                <div className="col-sm-6">
                    <h3>Block Infos</h3>
                    {makeBlockDataTable(blockData)}
                </div>
                <div className="col-sm-6">
                    <h3>Block Transactions</h3>
                    <table className='table table-bordered'>
                        <tbody>
                            {blockTransactions.map((entry) => {
                                return <tr key={entry}><td><Link to={"/transaction/" + entry}>{entry}</Link></td></tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

export default Block;