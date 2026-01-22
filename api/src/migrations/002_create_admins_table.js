exports.up = function (knex) {
    return knex.schema.createTable('admins', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.string('email', 255).unique().notNullable();
          table.string('password_hash', 255).notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('admins');
};
