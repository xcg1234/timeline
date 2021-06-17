import './app.css';

// import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room'; //the material UI drop icon
import StarIcon from '@material-ui/icons/Star';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './component/Register.jsx';
import Login from './component/Login.jsx';
import Geocoder from 'react-map-gl-geocoder';

function App() {
	const mapRef = useRef();
	const myStorage = window.localStorage; // initialized the local storage
	const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
	const [pins, setPins] = useState([]); //initialize the pin array
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null); //create new pin when double click
	const [title, setTitle] = useState(null);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [desc, setDesc] = useState(null);
	const [rating, setRating] = useState(0);
	const [viewport, setViewport] = useState({
		width: '100vw',
		height: '100vh',
		latitude: 37.6,
		longitude: -95.665,
		zoom: 4,
	});

	const handleViewportChange = useCallback(
		(newViewport) => setViewport(newViewport),
		[]
	);
	const handleMarkerClick = (id, lat, long) => {
		//check the detail of the current pin you stayed on
		setCurrentPlaceId(id);
		setViewport({
			...viewport,
			latitude: lat,
			longitude: long,
		});
	};

	//add location when dblclick and create a new "newPlace" which will also trigger popup
	const handleAddClick = (e) => {
		const [long, lat] = e.lngLat;
		setNewPlace({
			lat,
			long,
		});
	};

	//handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
			username: currentUser,
			title,
			desc,
			rating,
			lat: newPlace.lat,
			long: newPlace.long,
		};
		//send to backend
		try {
			const res = await axios.post(
				'https://timeline-x.herokuapp.com/pins',
				newPin
			);
			setPins([...pins, res.data]); //add the new pin to pin array
			setNewPlace(null); //close the popup after submit
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const getPins = async () => {
			try {
				const allPins = await axios.get(
					'https://timeline-x.herokuapp.com/pins'
				); //grab pins data from backend database and set to pins state
				setPins(allPins.data);
			} catch (error) {
				console.log(error);
			}
		};
		getPins();
	}, []);

	const handleLogout = () => {
		myStorage.removeItem('user');
		setCurrentUser(null);
	};

	const handleGeocoderViewportChange = useCallback(
		(newViewport) => {
			const geocoderDefaultOverrides = { transitionDuration: 1000 };

			return handleViewportChange({
				...newViewport,
				...geocoderDefaultOverrides,
			});
		},
		[handleViewportChange]
	);

	return (
		<div className='App'>
			<ReactMapGL
				{...viewport}
				mapStyle='mapbox://styles/xcg1234/ckpoby1jx0xt117phqtxc5hhb'
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX} // linked to the token in env file
				onViewportChange={handleViewportChange}
				onDblClick={handleAddClick}
				ref={mapRef}
			>
				<Geocoder
					mapRef={mapRef}
					onViewportChange={handleGeocoderViewportChange}
					mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
					position='top-left'
				/>
				{pins.map((p) => (
					<div key={p.createdAt}>
						<Marker
							latitude={p.lat}
							longitude={p.long}
							offsetLeft={-viewport.zoom * 3.5}
							offsetTop={-viewport.zoom * 7}
						>
							<RoomIcon
								style={{
									fontSize: viewport.zoom * 7,
									color: p.username === currentUser ? 'tomato' : 'slateblue',
									cursor: 'pointer',
								}}
								onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
							/>
						</Marker>
						{p._id === currentPlaceId && (
							<Popup
								latitude={p.lat}
								longitude={p.long}
								closeButton={true}
								closeOnClick={false}
								anchor='left'
								onClose={() => {
									setCurrentPlaceId(null);
								}}
							>
								<div className='card'>
									<label>Place</label>
									<h4 className='place'>{p.title}</h4>
									<label>Review</label>
									<p className='desc'>{p.desc}</p>
									<label>Rating</label>

									<div className='stars'>
										{Array(p.rating).fill(<StarIcon className='star' />)}
									</div>

									<label>Info</label>
									<span className='username'>
										Created by <b>{p.username}</b>
									</span>
									<span className='date'>{format(p.createdAt)}</span>
								</div>
							</Popup>
						)}
					</div>
				))}
				{/* double click to add new pin based on cursor's lon/lat, if there is a new entry, show the pop up */}
				{newPlace && (
					<Popup
						key={newPlace.createdAt}
						latitude={newPlace.lat}
						longitude={newPlace.long}
						closeButton={true}
						closeOnClick={false}
						anchor='top'
						onClose={() => {
							setNewPlace(null);
						}}
					>
						<div>
							<form onSubmit={handleSubmit}>
								<label>Title</label>
								<input
									type='text'
									placeholder='Enter the title'
									onChange={(e) => setTitle(e.target.value)}
								/>
								<label>Review</label>
								<textarea
									placeholder='Say something about the place.'
									onChange={(e) => setDesc(e.target.value)}
								/>
								<label>Rating</label>
								<select onChange={(e) => setRating(e.target.value)}>
									<option value='1'>1</option>
									<option value='2'>2</option>
									<option value='3'>3</option>
									<option value='4'>4</option>
									<option value='5'>5</option>
								</select>
								<button className='submitButton' type='submit'>
									Add Pin
								</button>
							</form>
						</div>
					</Popup>
				)}
				{currentUser ? (
					<button className='button logout' onClick={handleLogout}>
						Log Out
					</button>
				) : (
					<div className='buttons'>
						<button className='button login' onClick={() => setShowLogin(true)}>
							Login
						</button>
						<button
							className='button register'
							onClick={() => setShowRegister(true)}
						>
							Register
						</button>
					</div>
				)}

				{showRegister && <Register setShowRegister={setShowRegister} />}
				{showLogin && (
					<Login
						setShowLogin={setShowLogin}
						myStorage={myStorage}
						setCurrentUsername={setCurrentUser}
					/>
				)}
			</ReactMapGL>
		</div>
	);
}

export default App;
