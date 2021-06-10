import './register.css';
import { useState } from 'react';
import RoomIcon from '@material-ui/icons/Room';
function Register() {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	return (
		<div className='registerContainer'>
			<div className='logo'>
				<RoomIcon />
				Timeline
			</div>
			<form action=''>
				<input type='text' placeholder='Username' />
				<input type='email' placeholder='Email' />
				<input type='password' placeholder='Password' />
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
		</div>
	);
}

export default Register;
