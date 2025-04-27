const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');

const products = require('./data/products');

dotenv.config();

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

//Func to seed data

const seedData = async () => {
    try {
        //Delete all existing products
        await Product.deleteMany({});
        await User.deleteMany({});
        await Cart.deleteMany({});

        //create a default admin user
        const createdUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
        });

        //Assign default user ID to each product
        const userId = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {
                ...product,
                user: userId,
            };
        });

        //Insert products into the database
        await Product.insertMany(sampleProducts);

        console.log('Product Data seeded successfully !!!11');
        process.exit();

    } catch (error) {
        console.error('Error deleting products:', error);
        process.exit(1);
    }
};

seedData();