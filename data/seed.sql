CREATE TABLE "user" (
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'user',
  token INTEGER NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE "event" (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  owner VARCHAR NOT NULL REFERENCES "user" (email) ON DELETE CASCADE ON UPDATE CASCADE,
  mode INTEGER NOT NULL,
  datetimes TIMESTAMP WITH TIME ZONE[] NOT NULL,
  status INTEGER NOT NULL DEFAULT 1,
  latitude FLOAT,
  longitude FLOAT,
  link VARCHAR,
  bookings JSONB DEFAULT NULL
);

INSERT INTO "user" (email, name, surname, role, token) VALUES 
  ('alessio@gmail.com', 'Alessio', 'Paolucci', 'admin', 10),
  ('ciccio@gmail.com', 'Ciccio', 'Rossi', 'user', 0),
  ('pippo@gmail.com', 'Pippo', 'Rossi', 'user', 7);

INSERT INTO event (title, owner, mode, datetimes, status, latitude, longitude, link, bookings) VALUES
  ('Riunione PA', 'ciccio@gmail.com', 1, '{"2023-07-08 10:00:00+01", "2023-07-08 11:00:00+01"}', 1, NULL, NULL, NULL, '[{
	"datetime": "2023-07-08T09:00:00.000Z",
	"email": "pippo@gmail.com"
}, {
	"datetime": "2023-07-08T10:00:00.000Z",
	"email": "ciccio@gmail.com"
}]'),
  ('Incontro CLAB', 'pippo@gmail.com', 2, '{"2023-08-01 14:00:00+01", "2023-08-04 15:00:00+01", "2023-08-04 16:00:00+01", "2023-08-01 17:00:00+01"}', 1, NULL, NULL, NULL, NULL),
  ('Riunone Amministrazione', 'alessio@gmail.com', 3, '{"2023-09-15 09:00:00+01"}', 1, NULL, NULL, NULL, '[{
	"datetime": "2023-09-15T08:00:00.000Z",
	"email": "ciccio@gmail.com"
}]');