const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
const PORT = process.env.PORT || 8800;
app.use(express.static(path.join(__dirname, './frontend/build')));
dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch((e) => console.log(e));

app.get('/', (req, res) => {
	res.send('Hello World!');
});
// use the router created above
app.use('/pins', pinRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
	console.log('backend is running');
});
