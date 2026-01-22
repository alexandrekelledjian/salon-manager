exports.up = function (knex) {
    return knex.schema.createTable('salons', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.string('code_url', 100).unique().notNullable();
          table.string('nom', 255).notNullable();
          table.string('email', 255).nullable();
          table.string('telephone', 50).nullable();
          table.text('adresse').nullable();
          table.text('logo_url').nullable();
          table.boolean('actif').notNullable().defaultTo(true);
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
          table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

                                       table.index('code_url', 'idx_salons_code_url');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('salons');
};
