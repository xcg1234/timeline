const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

dotenv.config();
app.use(express.json());

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
	res.send('haha');
});

app.use('/api/pins', pinRoute); // use the router created above
app.use('/api/users', userRoute);

app.listen(3000, () => {
	console.log('backend is running');
});
