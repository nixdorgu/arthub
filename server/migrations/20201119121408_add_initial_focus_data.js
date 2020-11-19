
exports.up = function(knex) {
  return knex.raw(`
    INSERT INTO focus VALUES
        (DEFAULT, 'Animation'),
        (DEFAULT, 'Calligraphy'),
        (DEFAULT, 'Engraving'),
        (DEFAULT, 'Graphic Design'),
        (DEFAULT, 'Illustration'),
        (DEFAULT, 'Packaging Graphic Design'),
        (DEFAULT, 'Painting'),
        (DEFAULT, 'Poster Design'),
        (DEFAULT, 'Sculpture Design'),
        (DEFAULT, 'UI Design'),
        (DEFAULT, 'UI/UX'),
        (DEFAULT, 'UX Design'),
        (DEFAULT, 'Others')
  `);
};

exports.down = function(knex) {
  return knex.raw(`TRUNCATE TABLE focus`);
};
