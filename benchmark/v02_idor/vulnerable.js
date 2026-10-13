// Vulnerable: Direct object reference without verifying ownership
const express = require('express');
const app = express();

const db = {
    docs: {
        'doc_1': { id: 'doc_1', ownerId: 'user_alice', secretData: 'Alice private notes' },
        'doc_2': { id: 'doc_2', ownerId: 'user_bob', secretData: 'Bob tax returns' }
    }
};

app.get('/api/documents/:id', (req, res) => {
    const doc = db.docs[req.params.id];
    if (!doc) return res.status(404).send('Not found');
    // Flaw: No check that req.user.id === doc.ownerId
    res.json(doc);
});

app.listen(3000);
