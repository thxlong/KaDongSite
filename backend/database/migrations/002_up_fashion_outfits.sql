-- =====================================================
-- Fashion Outfits Table Migration
-- Adds color matching and outfit management feature
-- Created: 2025-11-11
-- =====================================================

-- =====================================================
-- FASHION_OUTFITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fashion_outfits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    shirt_color VARCHAR(50) NOT NULL,
    pants_color VARCHAR(50) NOT NULL,
    shoes_color VARCHAR(50) NOT NULL,
    hat_color VARCHAR(50),
    bag_color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Constraints
    CONSTRAINT check_shirt_color CHECK (shirt_color IN (
        'red', 'orange', 'yellow', 'green', 'blue', 
        'purple', 'brown', 'black', 'white', 'gray',
        'pink', 'peach', 'cream', 'mint', 'sky'
    )),
    CONSTRAINT check_pants_color CHECK (pants_color IN (
        'red', 'orange', 'yellow', 'green', 'blue', 
        'purple', 'brown', 'black', 'white', 'gray',
        'pink', 'peach', 'cream', 'mint', 'sky'
    )),
    CONSTRAINT check_shoes_color CHECK (shoes_color IN (
        'red', 'orange', 'yellow', 'green', 'blue', 
        'purple', 'brown', 'black', 'white', 'gray',
        'pink', 'peach', 'cream', 'mint', 'sky'
    )),
    CONSTRAINT check_hat_color CHECK (hat_color IS NULL OR hat_color IN (
        'red', 'orange', 'yellow', 'green', 'blue', 
        'purple', 'brown', 'black', 'white', 'gray',
        'pink', 'peach', 'cream', 'mint', 'sky'
    )),
    CONSTRAINT check_bag_color CHECK (bag_color IS NULL OR bag_color IN (
        'red', 'orange', 'yellow', 'green', 'blue', 
        'purple', 'brown', 'black', 'white', 'gray',
        'pink', 'peach', 'cream', 'mint', 'sky'
    )),
    CONSTRAINT check_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Indexes for fashion_outfits
CREATE INDEX idx_fashion_outfits_user_id ON fashion_outfits(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_fashion_outfits_user_created ON fashion_outfits(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_fashion_outfits_created_at ON fashion_outfits(created_at DESC);

-- Create trigger function for updated_at if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_fashion_outfits_updated_at ON fashion_outfits;
CREATE TRIGGER update_fashion_outfits_updated_at
    BEFORE UPDATE ON fashion_outfits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO migrations (name) 
VALUES ('002_up_fashion_outfits')
ON CONFLICT (name) DO NOTHING;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Fashion Outfits table created successfully';
END $$;
