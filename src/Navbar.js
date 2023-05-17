import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';

function Navbar({ alchemy }) {
    const [myOptions, setMyOptions] = useState([]);

    const getDataFromAPI = () => {
        const myOptions = ['1', '2', '3'];
        setMyOptions(myOptions)
    }

    return (
        <nav className='navbar navbar-expand bg-light fixed-top shadow p-0' >
            <div className="container-fluid">
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/block" className="nav-link">Block</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/transaction" className="nav-link">Transaction</Link>
                    </li>
                </ul>
                <div className="d-flex" role="search">
                    <Autocomplete
                        style={{ width: '300px', }}
                        size="small"
                        freeSolo
                        autoComplete
                        autoHighlight
                        options={myOptions}
                        renderInput={(params) => (
                            <TextField {...params}
                                onChange={getDataFromAPI}
                                variant="outlined"
                                label="Search"
                            />
                        )}
                    />
                </div>

            </div>
        </nav>
    );
}

export default Navbar;