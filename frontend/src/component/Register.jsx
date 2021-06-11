import './register.css';
import { useState, useRef } from 'react';
import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios';
function Register({ setShowRegister }) {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			username: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			await axios.post(
				'https://timeline-x.herokuapp.com/users/register',
				newUser
			);
			setError(false);
			setSuccess(true);
		} catch (error) {
			setError(true);
		}
	};

	return (
		<div className='registerContainer'>
			<div className='logo'>
				<RoomIcon />
				Timeline
			</div>
			<form onSubmit={handleSubmit}>
				<input type='text' placeholder='Username' ref={nameRef} />
				<input type='email' placeholder='Email' ref={emailRef} />
				<input type='password' placeholder='Password' ref={passwordRef} />
				<button className='registerBtn'>Register</button>
				{success && (
					<span className='success'>
						Successfully registered, you can now login.
					</span>
				)}
				{error && (
					<span className='error'>
						Something wrong happened, please try again.
					</span>
				)}
			</form>
			<CancelIcon
				className='registerCancel'
				onClick={() => setShowRegister(false)}
			/>
		</div>
	);
}

export default Register;
