const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const dotenv = require("dotenv");
const dbConnect = require('./config/database');

dotenv.config();

dbConnect();

const app = express();

app.use(
    cors({
        origin : "http://localhost:5173",
        methods : ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials : true
    })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server running suceessfully ${PORT}`);
})