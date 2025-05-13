-- Drop existing tables if needed
-- DROP TABLE IF EXISTS public.logs;
-- DROP TABLE IF EXISTS public.users;

-- Tạo bảng users với tham chiếu đến auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    provider TEXT,
    provider_id TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS cho bảng users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho bảng users
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Tạo bảng logs
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    mood TEXT NOT NULL CHECK (mood IN ('excited', 'happy', 'neutral', 'tired', 'frustrated', 'sad')),
    work_type TEXT NOT NULL CHECK (work_type IN ('work', 'learning', 'personal', 'health', 'social', 'leisure')),
    energy_level INTEGER NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
    meaning_level INTEGER NOT NULL CHECK (meaning_level BETWEEN 1 AND 5),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS cho bảng logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho bảng logs
CREATE POLICY "Users can view their own logs"
    ON public.logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
    ON public.logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
    ON public.logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
    ON public.logs FOR DELETE
    USING (auth.uid() = user_id);

-- Tạo indexes để tối ưu performance
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS logs_date_idx ON public.logs(date);
CREATE INDEX IF NOT EXISTS logs_mood_idx ON public.logs(mood);
CREATE INDEX IF NOT EXISTS logs_work_type_idx ON public.logs(work_type);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo triggers để tự động cập nhật updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.logs;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Tạo function để tạo bảng users (cho trường hợp cần thiết)
CREATE OR REPLACE FUNCTION public.create_users_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create users table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.users (
        id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        provider TEXT,
        provider_id TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );

    -- Enable Row Level Security
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    -- Create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can view their own data'
    ) THEN
        CREATE POLICY "Users can view their own data" ON public.users
            FOR SELECT
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can update their own data'
    ) THEN
        CREATE POLICY "Users can update their own data" ON public.users
            FOR UPDATE
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert their own data'
    ) THEN
        CREATE POLICY "Users can insert their own data" ON public.users
            FOR INSERT
            WITH CHECK (auth.uid() = id);
    END IF;
END;
$$; 