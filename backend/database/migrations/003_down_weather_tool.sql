-- Weather Tool: Drop favorite_cities and weather_cache tables
-- Migration: DOWN (Rollback)

-- Drop triggers first
DROP TRIGGER IF EXISTS trigger_update_favorite_cities_updated_at ON favorite_cities;

-- Drop functions
DROP FUNCTION IF EXISTS update_favorite_cities_updated_at();
DROP FUNCTION IF EXISTS delete_expired_weather_cache();

-- Drop tables (CASCADE to drop dependent objects)
DROP TABLE IF EXISTS weather_cache CASCADE;
DROP TABLE IF EXISTS favorite_cities CASCADE;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Weather Tool tables dropped successfully!';
  RAISE NOTICE 'Rollback complete.';
END $$;
