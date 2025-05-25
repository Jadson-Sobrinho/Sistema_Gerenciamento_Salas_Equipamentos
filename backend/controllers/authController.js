const Usuario = require('../models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const isMatch = await bcrypt.compare(password, user.password || user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const payload = { sub: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'sua_chave_secreta', { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};