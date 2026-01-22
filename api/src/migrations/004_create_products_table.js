exports.up = function (knex) {
    return knex.schema.createTable('products', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.uuid('salon_id').notNullable();
          table.string('name', 255).notNullable();
          table.text('description').nullable();
          table.integer('price_cents').notNullable();
          table.text('image_url').nullable();
          table.boolean('active').notNullable().defaultTo(true);
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
          table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

                                       table.foreign('salon_id').references('id').inTable('salons').onDelete('CASCADE');
          table.index('salon_id', 'idx_products_salon_id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('products');
};
