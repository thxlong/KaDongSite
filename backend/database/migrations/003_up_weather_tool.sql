-- Weather Tool: favorite_cities and weather_cache tables
-- Migration: UP (Create tables)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create favorite_cities table
CREATE TABLE IF NOT EXISTS favorite_cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes for favorite_cities
CREATE INDEX idx_favorite_cities_user_id ON favorite_cities(user_id);
CREATE INDEX idx_favorite_cities_created_at ON favorite_cities(created_at DESC);
CREATE INDEX idx_favorite_cities_deleted_at ON favorite_cities(deleted_at);
CREATE INDEX idx_favorite_cities_location ON favorite_cities(lat, lon);

-- Unique constraint: one user can't have duplicate cities
CREATE UNIQUE INDEX idx_favorite_cities_user_city 
  ON favorite_cities(user_id, city_name, country) 
  WHERE deleted_at IS NULL;

-- Create weather_cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  weather_data JSONB NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for weather_cache
CREATE INDEX idx_weather_cache_location ON weather_cache(lat, lon);
CREATE INDEX idx_weather_cache_expires_at ON weather_cache(expires_at);
CREATE INDEX idx_weather_cache_city_name ON weather_cache(city_name);
CREATE INDEX idx_weather_cache_fetched_at ON weather_cache(fetched_at DESC);

-- GIN index for JSONB data
CREATE INDEX idx_weather_cache_data ON weather_cache USING GIN (weather_data);

-- Unique constraint: one cache entry per location
CREATE UNIQUE INDEX idx_weather_cache_location_unique 
  ON weather_cache(lat, lon, city_name);

-- Create trigger to update updated_at on favorite_cities
CREATE OR REPLACE FUNCTION update_favorite_cities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_favorite_cities_updated_at
  BEFORE UPDATE ON favorite_cities
  FOR EACH ROW
  EXECUTE FUNCTION update_favorite_cities_updated_at();

-- Create function to auto-delete expired cache entries
CREATE OR REPLACE FUNCTION delete_expired_weather_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM weather_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comment tables
COMMENT ON TABLE favorite_cities IS 'User favorite cities for weather tool';
COMMENT ON TABLE weather_cache IS 'Cache for weather API responses (30min for current, 6hr for forecast)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Weather Tool tables created successfully!';
  RAISE NOTICE 'Tables: favorite_cities, weather_cache';
  RAISE NOTICE 'Next step: Add WEATHER_API_KEY to .env file';
END $$;
