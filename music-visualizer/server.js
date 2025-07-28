const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML files directly
app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    // Only serve HTML files to prevent access to sensitive files
    if (filename.endsWith('.html')) {
        res.sendFile(path.join(__dirname, filename));
    } else {
        res.status(404).send('Not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
