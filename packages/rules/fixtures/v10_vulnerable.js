const express = require('express');
const cors = require('cors');
const app = express();

// Vulnerable: Wildcard origin with credentials enabled
app.use(cors({
    origin: '*',
    credentials: true
}));

app.get('/api/data', (req, res) => {
    res.json({ secret: 'user-data' });
});
