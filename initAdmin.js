const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');


mongoose.connect('uri_mongo').then(async () => {
    const exists = await User.findOne({ email: 'chizato@gmail.com' });
    if (!exists) {
        const admin = new User({
            name: 'Chizato',
            email: 'Chizato@gmail.com',
            password: await bcrypt.hash('1234', 10),
            isAdmin: true
        });
        await admin.save();
        console.log('Admin creado');
    } else {
        console.log('admin ya existe');
    }
    process.exit();
});