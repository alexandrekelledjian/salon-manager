const db = require('../config/database');

const getSalonByCode = async (req, res) => {
      try {
              const { code_url } = req.params;
              const salon = await db('salons').where({ code_url, actif: true }).first();
              if (!salon) return res.status(404).json({ error: 'Salon non trouvé' });
              res.json(salon);
      } catch (err) {
              res.status(500).json({ error: 'Erreur serveur' });
      }
};

const getProductsBySalonCode = async (req, res) => {
      try {
              const { code_url } = req.params;

        const salon = await db('salons').where({ code_url, actif: true }).first();
              if (!salon) {
                        return res.status(404).json({ error: 'Salon non trouvé' });
              }

        const products = await db('products')
                .where({ salon_id: salon.id, active: true })
                .select('id', 'name', 'description', 'price_cents', 'image_url')
                .orderBy('name', 'asc');

        res.json({ products });
      } catch (err) {
              res.status(500).json({ error: 'Erreur serveur' });
      }
};

module.exports = { getSalonByCode, getProductsBySalonCode };
