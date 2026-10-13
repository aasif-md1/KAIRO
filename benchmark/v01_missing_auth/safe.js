// Safe: Express route handler with authentication and role middleware
const express = require('express');
const app = express();

const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
};

app.get('/api/admin/system-stats', requireAuth, requireAdmin, (req, res) => {
    res.json({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        db_connections: 42
    });
});

app.listen(3000);
