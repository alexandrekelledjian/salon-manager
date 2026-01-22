const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const login = async (req, res) => {
    try {
          const { email, password } = req.body;

      if (!email || !password) {
              return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const admin = await db('admins').where({ email }).first();

      if (!admin) {
              return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const validPassword = await bcrypt.compare(password, admin.password_hash);

      if (!validPassword) {
              return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
              process.env.JWT_SECRET,
        { expiresIn: '24h' }
            );

      res.json({ token });
    } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { login };
