const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
const PORT = 8800;

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
	res.send('Hello World!');
});
// use the router created above
app.use('/pins', pinRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
	console.log('backend is running');
});
