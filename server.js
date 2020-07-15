const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Datebase
connectDB();

//Init Middleware
app.use(express.json({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/malfunctions', require('./routes/api/malfunctions'));
app.use('/jumpers', require('./routes/api/jumpers'));
app.use('/notes', require('./routes/api/notes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
