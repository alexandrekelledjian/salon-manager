const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
    // Clean tables
    await knex('salons').del();
    await knex('admins').del();

    // Insert admin
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await knex('admins').insert({
          email: 'admin@example.com',
          password_hash: passwordHash,
    });

    // Insert salons
    await knex('salons').insert([
      {
              code_url: 'HAIR75001',
              nom: 'Salon Coiffure Paris',
              email: 'contact@hair75001.fr',
              telephone: '0145678901',
              adresse: '12 rue de Rivoli, 75001 Paris',
              actif: true,
      },
      {
              code_url: 'NAIL69001',
              nom: 'Onglerie Lyon',
              email: 'contact@nail69001.fr',
              telephone: '0478901234',
              adresse: '45 rue de la République, 69001 Lyon',
              actif: true,
      },
      {
              code_url: 'SPA13001',
              nom: 'Spa Marseille',
              email: 'contact@spa13001.fr',
              telephone: '0491234567',
              adresse: '8 avenue du Prado, 13008 Marseille',
              actif: false,
      },
        ]);
};
