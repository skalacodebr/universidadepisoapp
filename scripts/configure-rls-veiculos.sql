-- Enable RLS on veiculos table
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting veiculos (allow all authenticated users to read)
CREATE POLICY select_veiculos ON veiculos
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for inserting veiculos (allow authenticated users to insert)
CREATE POLICY insert_veiculos ON veiculos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for updating veiculos (allow authenticated users to update their own records)
CREATE POLICY update_veiculos ON veiculos
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- Create policy for deleting veiculos (allow authenticated users to delete their own records)
CREATE POLICY delete_veiculos ON veiculos
    FOR DELETE
    TO authenticated
    USING (auth.uid()::text = user_id::text);
