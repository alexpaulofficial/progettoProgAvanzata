CREATE TABLE "user" (
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'user',
  token INTEGER NOT NULL check (token >= 0),
  PRIMARY KEY (email)
);

CREATE TABLE "event" (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  owner VARCHAR NOT NULL REFERENCES "user" (email) ON DELETE CASCADE ON UPDATE CASCADE,
  mode INTEGER NOT NULL check (mode between 1 and 3),
  datetimes TIMESTAMP WITH TIME ZONE[] NOT NULL,
  status INTEGER NOT NULL DEFAULT 1 check (status between 0 and 1),
  latitude FLOAT check (latitude between -90 and 90),
  longitude FLOAT check (longitude between -180 and 180),
  link VARCHAR,
  bookings JSONB DEFAULT NULL
);

INSERT INTO "user" (email, name, surname, role, token) VALUES 
  ('alessio@gmail.com', 'Alessio', 'Paolucci', 'admin', 10),
  ('ciccio@gmail.com', 'Ciccio', 'Rossi', 'user', 2),
  ('pippo@gmail.com', 'Pippo', 'Rossi', 'user', 7),
  ('adriano@gmail.com', 'Adriano', 'Rossi', 'user', 20);

INSERT INTO event (title, owner, mode, datetimes, status, latitude, longitude, link, bookings) VALUES
  ('Riunione PA', 'ciccio@gmail.com', 1, '{"2023-07-08 10:00:00+01", "2023-07-08 11:00:00+01","2023-07-08 12:00:00+01", "2023-07-09 11:00:00+00","2023-07-09 12:00:00+00"}', 1, NULL, NULL, NULL, '[{
	"datetimes": "2023-07-08T09:00:00.000Z",
	"user": "pippo@gmail.com"
}, {
	"datetimes": ["2023-07-08T10:00:00.000Z"],
	"user": "ciccio@gmail.com"
}]'),
  ('Incontro CLAB', 'pippo@gmail.com', 2, '{"2023-08-01 14:00:00+01", "2023-08-04 15:00:00+01", "2023-08-04 16:00:00+01", "2023-08-01 17:00:00+01"}', 1, NULL, NULL, NULL, NULL),
  ('Riunone Amministrazione', 'alessio@gmail.com', 3, '{"2023-09-15T08:00:00.000Z","2023-09-15 10:00:00+01"}', 1, NULL, NULL, NULL, '[{
	"datetimes": ["2023-09-15T08:00:00.000Z"],
	"user": "ciccio@gmail.com"
}]'),
('Incontro CEO', 'pippo@gmail.com', 2, '{"2023-08-10 14:00:00+01", "2023-08-11 15:00:00+01", "2023-08-10 16:00:00+01", "2023-08-10 17:00:00+01"}', 1, NULL, NULL, NULL, NULL);