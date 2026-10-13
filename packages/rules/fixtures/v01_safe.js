const express = require('express');
const app = express();

function authenticate(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

app.use(express.json());

// Safe: Authenticated POST route with middleware
app.post('/api/invoices', authenticate, (req, res) => {
    const { amount, recipient } = req.body;
    res.json({ status: 'created', invoiceId: 123 });
});

app.listen(3000);
