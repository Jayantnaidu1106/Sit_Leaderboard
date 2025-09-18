console.log('Hello from Node.js!');
console.log('Current working directory:', process.cwd());
console.log('Node.js version:', process.version);

try {
    const mongoose = require('mongoose');
    console.log('Mongoose loaded successfully, version:', mongoose.version);
} catch (error) {
    console.error('Error loading mongoose:', error.message);
}
