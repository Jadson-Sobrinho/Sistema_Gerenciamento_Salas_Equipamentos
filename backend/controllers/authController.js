const Usuario = require('../models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

//Login de usuário e emissão de JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    //Comparar senha informada com hash armazenado
    const isMatch = await bcrypt.compare(password, user.password || user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const payload = {
      sub:  user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    //Geração do token JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'chave_secreta',
      { expiresIn: '1h' }
    );
    console.log(token);
    //Retornar token e dados públicos do usuário
    return res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

//Middleware para validar JWT em rotas protegidas
exports.authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(
    token, 'chave_secreta', (err, decoded) => {
      if (err) {
        console.error('Erro ao verificar token:', err);
        return res.status(403).json({ error: 'Token inválido ou expirado' });
      }
      console.log('decoded JWT:', decoded);
      //Armazena o payload decodificado em req.user
      req.user = decoded;
      next();
    }
  );
};

//Rota para retornar perfil do usuário logado
exports.getProfile = (req, res) => {
  const { sub: id, name, email, role } = req.user;
  return res.json({ id, name, email, role });
};


exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({error: "Acesso negado!"})
    }
    next();
  }
};