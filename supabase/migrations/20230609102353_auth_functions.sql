create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profile (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();