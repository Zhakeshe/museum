CREATE TABLE IF NOT EXISTS museums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  hours TEXT NOT NULL,
  badge TEXT NOT NULL,
  price TEXT NOT NULL,
  kids BOOLEAN NOT NULL,
  rating NUMERIC NOT NULL,
  hue INTEGER NOT NULL,
  phone TEXT NOT NULL,
  website TEXT NOT NULL,
  image TEXT NOT NULL,
  gis_link TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  points INTEGER NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  visits INTEGER NOT NULL,
  last_active TEXT NOT NULL
);
