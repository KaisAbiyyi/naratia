-- Reset data contoh hanya boleh dipanggil akun uji yang sedang login, dan hanya di database
-- yang flag dev_tools-nya menyala. Anon tidak bisa memanggilnya sama sekali.
create or replace function public.dev_reset_sample()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	if not coalesce((select f.value from private.app_flags f where f.key = 'dev_tools'), false) then
		raise exception 'dev_tools_disabled' using errcode = '42501';
	end if;
	if coalesce((auth.jwt() -> 'app_metadata' ->> 'test_account')::boolean, false) is not true then
		raise exception 'test_account_required' using errcode = '42501';
	end if;
	perform private.seed_sample();
end;
$$;

revoke execute on function public.dev_reset_sample() from public, anon;
grant execute on function public.dev_reset_sample() to authenticated;
