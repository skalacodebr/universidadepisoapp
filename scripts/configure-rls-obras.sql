-- Enable Row Level Security
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

-- Policy for all operations (since auth is handled at app level)
CREATE POLICY "Enable all operations for all users"
ON obras
FOR ALL
USING (true);

-- Grant necessary permissions
GRANT ALL ON obras TO authenticated;
GRANT ALL ON obras TO anon; 