const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const newUUser = new User({ name, email, password: hashedPass, isAdmin });
    await newUUser.save();
    res.status(201).json({ message: 'Usuario creado' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user  || !await bcrypt.compare(password, user.password))
        return res.status(401).json({ message: 'Credenciales invalidas' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ token })
}

// listar usuarios, editar y borrar