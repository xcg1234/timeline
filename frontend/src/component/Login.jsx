import './login.css';
import { useState, useRef } from 'react';
import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios';

function Login({ setShowLogin, setCurrentUsername, myStorage }) {
	const [error, setError] = useState(false);
	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			username: usernameRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			const res = await axios.post(
				'https://timeline-xx.herokuapp.com/users/login',
				user
			);
			setCurrentUsername(res.data.username); // store the user info to local storage
			myStorage.setItem('user', res.data.username);
			setShowLogin(false);
		} catch (err) {
			setError(true);
		}
	};
	return (
		<div className='loginContainer'>
			<div className='logo'>
				<RoomIcon className='logoIcon' />
				<span>Timeline</span>
			</div>
			<form onSubmit={handleSubmit}>
				<input autoFocus placeholder='Username' ref={usernameRef} />
				<input
					type='password'
					min='6'
					placeholder='Password'
					ref={passwordRef}
				/>
				<button className='loginBtn' type='submit'>
					Login
				</button>
				{error && <span className='failure'>Something went wrong!</span>}
			</form>
			<CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
		</div>
	);
}

export default Login;
