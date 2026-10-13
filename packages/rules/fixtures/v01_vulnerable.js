const express = require('express');
const app = express();

app.use(express.json());

// Vulnerable: POST state-changing route without any authentication check
app.post('/api/invoices', (req, res) => {
    const { amount, recipient } = req.body;
    res.json({ status: 'created', invoiceId: 123 });
});

app.listen(3000);
