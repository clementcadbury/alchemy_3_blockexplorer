import { Link } from "react-router-dom";
import { useNavigate   } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';

function Navbar({ alchemy }) {
    const [formError,setFormError] = useState('');

    const navigate = useNavigate();

    const searchSubmit = async (e) => {
        e.preventDefault();
        //console.log(e.target[0].value);
        const searchStr = e.target[0].value;
        if ( isValidAddress(searchStr) ){
            navigate(process.env.PUBLIC_URL + '/address/' + searchStr);
            e.target[0].value = '';
            setFormError('');
        } else if ( isHash(searchStr) ) {
            if ( await alchemy.core.getBlock(searchStr) ){
                navigate(process.env.PUBLIC_URL + '/block/' + searchStr);
                e.target[0].value = '';
                setFormError('');
            } else if ( await alchemy.core.getTransaction(searchStr) ){
                navigate(process.env.PUBLIC_URL + '/transaction/' + searchStr);
                e.target[0].value = '';
                setFormError('');
            }
        } else if ( filterInt(searchStr) ) {
            navigate(process.env.PUBLIC_URL + '/block/' + searchStr);
            e.target[0].value = '';
            setFormError('');
        } else {
            setFormError('1');
        }
    };

    return (
        <nav className='navbar navbar-expand bg-light fixed-top shadow p-0' >
            <div className="container-fluid">
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <Link to={`${process.env.PUBLIC_URL}/`} className="nav-link">Home</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to={`${process.env.PUBLIC_URL}/block`} className="nav-link">Block</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to={`${process.env.PUBLIC_URL}/transaction`} className="nav-link">Transaction</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to={`${process.env.PUBLIC_URL}/address`} className="nav-link">Address</Link>
                    </li>
                </ul>
                <div className="d-flex" role="search">
                    <form onSubmit={searchSubmit}>
                        <TextField
                            variant="outlined"
                            label="Search"
                            size="small"
                            margin="dense"
                            error={formError}
                        />
                    </form>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;

function isValidAddress(a) {
    return Utils.isHexString(a) && a.length === 42;
}

function isHash(a) {
    return Utils.isHexString(a) && a.length === 66;
}

function filterInt(value) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value))
      return Number(value);
    return null;
  }