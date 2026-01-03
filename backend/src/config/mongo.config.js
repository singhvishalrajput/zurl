import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path : './.env'});

// Cache the connection to reuse across serverless function calls
let cachedConnection = null;

const connectDB = async () => {
    // If already connected, reuse the connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection');
        return cachedConnection;
    }

    try{
        // Configure mongoose for serverless
        mongoose.set('strictQuery', false);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Optimize for serverless
            maxPoolSize: 10, // Limit connection pool size
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        console.log(`MONGODB Connected : ${conn.connection.host}`);
        cachedConnection = conn;
        return conn;
    }
    catch (error){
        console.log(`Error : ${error.message}`);
        // In serverless, don't exit the process
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
}

export default connectDB;