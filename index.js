import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/db/index.js';
import { app } from './src/app.js';


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER: Server is running on port ${PORT}`);
        console.log(`LINK: http://localhost:${PORT}`);
    });
    app.on('error', (error) => {
        console.error("EXPRESS: Express error:", error);
    });
}).catch((error) => {
    console.error("MONGO: Database connection error:", error);
})
