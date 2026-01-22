const SALON_CODE_URL = 'HAIR75001';

exports.seed = async function (knex) {
    const salon = await knex('salons').where({ code_url: SALON_CODE_URL }).first();

    if (!salon) {
          throw new Error(`Seed products: salon "${SALON_CODE_URL}" non trouve. Executez d'abord le seed 001.`);
    }

    await knex('products').where({ salon_id: salon.id }).del();

    await knex('products').insert([
      {
              salon_id: salon.id,
              name: 'Coupe Homme',
              description: 'Coupe classique avec finitions soignees',
              price_cents: 2500,
              image_url: null,
              active: true
      },
      {
              salon_id: salon.id,
              name: 'Coupe Femme',
              description: 'Coupe et brushing',
              price_cents: 4500,
              image_url: null,
              active: true
      },
      {
              salon_id: salon.id,
              name: 'Coloration',
              description: 'Coloration complete avec soin',
              price_cents: 6000,
              image_url: null,
              active: true
      },
      {
              salon_id: salon.id,
              name: 'Produit Inactif',
              description: 'Ce produit ne doit pas apparaitre',
              price_cents: 9999,
              image_url: null,
              active: false
      }
        ]);
};
