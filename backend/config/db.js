const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/traffic-system', {
            // useNewUrlParser: true, // Deprecated in newer mongoose versions
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error('---------------------------------------------------------');
        console.error('MongoDB Connection Failed! Please check the following:');
        console.error('1. Is your MongoDB server running? (Try running "mongod" in a separate terminal)');
        console.error('2. Is your connection string correct? (Check .env file)');
        console.error('3. Create a free cloud database at https://www.mongodb.com/atlas if you don\'t have a local one.');
        console.error('---------------------------------------------------------');
        process.exit(1);
    }
};

module.exports = connectDB;
