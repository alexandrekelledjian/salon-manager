const db = require('../config/database');
const { validateCreate, validateUpdate } = require('../validators/salonValidator');

const listSalons = async (req, res) => {
    try {
          const salons = await db('salons').orderBy('created_at', 'desc');
          res.json({ salons });
    } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Erreur serveur' });
    }
};

const createSalon = async (req, res) => {
    try {
          const { error, value } = validateCreate(req.body);

      if (error) {
              return res.status(400).json({ error: error.details[0].message });
      }

      // Check if code_url already exists (manual check)
      const existing = await db('salons').where({ code_url: value.code_url }).first();
          if (existing) {
                  return res.status(409).json({ error: 'code_url déjà utilisé' });
          }

      const [salon] = await db('salons').insert(value).returning('*');

      res.status(201).json(salon);
    } catch (err) {
          // Catch Postgres unique violation
      if (err.code === '23505') {
              return res.status(409).json({ error: 'code_url déjà utilisé' });
      }
          console.error(err);
          res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateSalon = async (req, res) => {
    try {
          const { id } = req.params;
          const { error, value } = validateUpdate(req.body);

      if (error) {
              return res.status(400).json({ error: error.details[0].message });
      }

      // Check if salon exists
      const existing = await db('salons').where({ id }).first();
          if (!existing) {
                  return res.status(404).json({ error: 'Salon non trouvé' });
          }

      // Check if code_url is being changed and already exists (manual check)
      if (value.code_url && value.code_url !== existing.code_url) {
              const duplicate = await db('salons').where({ code_url: value.code_url }).first();
              if (duplicate) {
                        return res.status(409).json({ error: 'code_url déjà utilisé' });
              }
      }

      // Explicitly update updated_at
      value.updated_at = new Date();

      const [salon] = await db('salons').where({ id }).update(value).returning('*');

      res.json(salon);
    } catch (err) {
          // Catch Postgres unique violation
      if (err.code === '23505') {
              return res.status(409).json({ error: 'code_url déjà utilisé' });
      }
          console.error(err);
          res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { listSalons, createSalon, updateSalon };
