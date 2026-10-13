// Vulnerable: Express route handler without authentication middleware
const express = require('express');
const app = express();

// Flawed: Sensitive administrative endpoint exposed publicly
app.get('/api/admin/system-stats', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        db_connections: 42
    });
});

app.listen(3000);
