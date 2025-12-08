-- Make documents bucket private instead of public
UPDATE storage.buckets 
SET public = false 
WHERE id = 'documents';