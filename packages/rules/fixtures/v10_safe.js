const express = require('express');
const cors = require('cors');
const app = express();

// Safe: Explicit allowed origin domain with credentials
app.use(cors({
    origin: 'https://trusted.example.com',
    credentials: true
}));

app.get('/api/data', (req, res) => {
    res.json({ secret: 'user-data' });
});
