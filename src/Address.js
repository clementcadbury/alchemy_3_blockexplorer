import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Utils } from 'alchemy-sdk';
import { Link } from "react-router-dom";

function Address({ alchemy }) {
    const [address, setAddress] = useState('');
    const [addressBalance, setAddressBalance] = useState(0);
    const [addressNonce, setAddressNonce] = useState(0);
    const [transfers, setTransfers] = useState([]);

    const params = useParams();

    useEffect(() => {
        async function fetchData() {

            if (isValidAddress(params.address)) {
                const ethBlockTime = 12.5;
                const timeBack = 31 * 24 * 60 * 60; // 1 month
                let blockNumber = (await alchemy.core.getBlock()).number;
                let sinceBlock = blockNumber - Math.floor(timeBack / ethBlockTime);

                const _addressBalance = Utils.formatEther(await alchemy.core.getBalance(params.address));
                //console.log((await alchemy.core.getBalance(params.address)))
                const _addressNonce = await alchemy.core.getTransactionCount(params.address);

                const _transfers = (await alchemy.core.getAssetTransfers({
                    fromBlock: sinceBlock,
                    fromAddress: params.address,
                    category: ["external", "internal", "erc20", "erc721", "erc1155"],
                    maxCount: '0x64', // 100
                    order: 'desc',
                })).transfers;

                setAddress(params.address);
                setAddressBalance(_addressBalance);
                setAddressNonce(_addressNonce);
                setTransfers(_transfers);

            }

        }
        fetchData();
    }, [alchemy, params.address]);

    const makeAddressTransferTable = () => {
        return (
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th scope="col">cat.</th>
                        <th scope="col">To</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((entry) => {
                        //console.log(entry);
                        /*let text = "";
                        if ( entry[0] === 'hash' || entry[0] === 'parentHash' || entry[0] === 'number' ){
                            text = <Link to={`/block/${entry[1]}`} >{entry[1]}</Link>;
                        } else {
                            text = entry[1];
                        }*/
                        const category = entry.hash ? <Link to={`/transaction/${entry.hash}`} >{entry.category}</Link> : entry.category;
                        const to = <Link to={`/address/${entry.to}`} >{entry.to}</Link>;
                        const asset = entry.rawContract.address ? <Link to={`/address/${entry.rawContract.address}`} >{entry.asset}</Link> : entry.asset;
                        return <tr key={entry.uniqueId}><td>{category}</td><td>{to}</td><td>{entry.value} {asset}</td></tr>
                    })}
                </tbody>
            </table>
        );
    };


    return (
        <div>
            <h2>Address {address}</h2>
            <div className="row my-3" style={{ textAlign: 'left' }}>
                <div className="col-sm-3">
                    <h3>Address Infos</h3>
                    <table className='table table-bordered'>
                        <tbody>
                            <tr><td>Balance</td><td>{addressBalance} Eth</td></tr>
                            <tr><td>Nonce</td><td>{addressNonce}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-sm-9">
                    <h3>Address Transactions</h3>
                    {makeAddressTransferTable()}
                </div>
            </div>
        </div>

    );
}

export default Address;

function isValidAddress(a) {
    return Utils.isHexString(a) && a.length === 42;
}