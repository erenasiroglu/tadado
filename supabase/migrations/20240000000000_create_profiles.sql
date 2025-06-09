-- Drop existing function and table if exists
drop function if exists handle_updated_at cascade;
drop table if exists users cascade;

-- Create a table for public users
create table users (
  id uuid primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;

-- Create policies
create policy "Public users are viewable by everyone." 
  on users for select 
  using ( true );

create policy "Enable insert for service role" 
  on users for insert 
  to authenticated, anon
  with check ( true );

create policy "Users can update own record."
  on users for update
  using ( auth.uid() = id );

-- Create a trigger to set updated_at on update
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on users
  for each row
  execute procedure handle_updated_at(); 