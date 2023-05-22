import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function Home({alchemy}) {
    const [blockNumber, setBlockNumber] = useState();

    useEffect(() => {
        async function getBlockNumber() {
            setBlockNumber(await alchemy.core.getBlockNumber());
        }

        getBlockNumber();
    });

    return <div>Latest Block : <Link to={ process.env.PUBLIC_URL + "/block/" + blockNumber}>{blockNumber}</Link></div>;
}

export default Home;