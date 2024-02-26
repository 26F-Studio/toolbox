CREATE TABLE IF NOT EXISTS tetrio_ranks
(
	name                    varchar(2)  not null,
	player_count            integer     not null,
	require_tr              decimal     not null,

	average_apm             decimal     not null,
	average_pps             decimal     not null,
	average_vs              decimal     not null,

	minimum_apm             decimal     not null,
	minimum_apm_player_id   char(24)    not null,
	minimum_apm_player_name varchar(16) not null,

	minimum_pps             decimal     not null,
	minimum_pps_player_id   char(24)    not null,
	minimum_pps_player_name varchar(16) not null,

	minimum_vs              decimal     not null,
	minimum_vs_player_id    char(24)    not null,
	minimum_vs_player_name  varchar(16) not null,

	maximum_apm             decimal     not null,
	maximum_apm_player_id   char(24)    not null,
	maximum_apm_player_name varchar(16) not null,

	maximum_pps             decimal     not null,
	maximum_pps_player_id   char(24)    not null,
	maximum_pps_player_name varchar(16) not null,

	maximum_vs              decimal     not null,
	maximum_vs_player_id    char(24)    not null,
	maximum_vs_player_name  varchar(16) not null,

	record_at               timestamp   not null
);

CREATE TABLE IF NOT EXISTS tetrio_players
(
	id              char(24)    not null,
	name            varchar(16) not null,
	tr              decimal     not null,

	apm             decimal     not null,
	pps             decimal     not null,
	vs              decimal     not null,

	sprint_40l_time decimal     not null,
	blitz_score     decimal     not null
);

SELECT cron.schedule('1', '0 * * * *',
					 $$SELECT net.http_post(url:='https://eirvihbwvudtrvgnoitk.supabase.co/functions/v1/tetrio_update', headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZpaGJ3dnVkdHJ2Z25vaXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MzE0NTIsImV4cCI6MjAyNDAwNzQ1Mn0.jXMvgsPbSJYp2RU7h6e8tm0Pf-_n17TBvJl2A0HeCFo"}'::jsonb);$$);