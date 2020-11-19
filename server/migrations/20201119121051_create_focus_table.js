
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE focus(
            id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
            focus_description TEXT NOT NULL
        );
  `);
};

exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE focus;
  `);
};
