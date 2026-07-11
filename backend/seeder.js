const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors'); // Removed dependency
const User = require('./models/User');
const TrafficRule = require('./models/TrafficRule');
const Violation = require('./models/Violation');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await TrafficRule.deleteMany();
        await Violation.deleteMany();

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create Police
        const policePassword = await bcrypt.hash('police123', salt);
        await User.create({
            name: 'Officer John',
            email: 'police@example.com',
            password: policePassword,
            role: 'police'
        });

        // Create Citizen
        const citizenPassword = await bcrypt.hash('123456', salt);
        await User.create({
            name: 'John Doe',
            email: 'citizen@example.com',
            password: citizenPassword,
            role: 'citizen',
            vehicleNumber: 'KA01AB1234'
        });

        // Create Rules
        const rules = [
            {
                ruleName: 'Over Speeding',
                description: 'Driving above the speed limit',
                fineAmount: 1000
            },
            {
                ruleName: 'Red Light Violation',
                description: 'Crossing the signal when it is red',
                fineAmount: 500
            },
            {
                ruleName: 'No Parking',
                description: 'Parking in a no-parking zone',
                fineAmount: 200
            },
            {
                ruleName: 'Drunk Driving',
                description: 'Driving under the influence of alcohol',
                fineAmount: 10000
            }
        ];

        await TrafficRule.insertMany(rules);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await TrafficRule.deleteMany();
        await Violation.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
