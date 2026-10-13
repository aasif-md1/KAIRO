// Safe: Ownership verified before returning record
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
    // Return 404 to avoid ID enumeration if not owner
    if (!doc || doc.ownerId !== req.user?.id) {
        return res.status(404).send('Document not found');
    }
    res.json(doc);
});

app.listen(3000);
