const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const authRouter = require('./routes/auth');
const enrollmentRouter = require('./routes/enrollment');

app.use('/auth', authRouter);
app.use('/enrollment/', enrollmentRouter);

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}!`));