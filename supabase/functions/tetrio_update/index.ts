import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { filter, first, isDefined, last, map, pipe, prop, sortBy, sumBy } from 'https://esm.sh/remeda'
import type { Database } from '~/types/supabase'

Deno.serve(async (request: Request) => {
	const results = new Array<unknown>()

	const supabase = createClient<Database>(
		Deno.env.get('SUPABASE_URL'),
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
		{
			global: {
				headers: {
					Authorization: request.headers.get('Authorization')
				}
			}
		}
	)

	const rank_percentiles = {
		x: 1,
		u: 5,
		ss: 11,
		's+': 17,
		s: 23,
		's-': 30,
		'a+': 38,
		a: 46,
		'a-': 54,
		'b+': 62,
		b: 70,
		'b-': 78,
		'c+': 84,
		c: 90,
		'c-': 95,
		'd+': 97.5,
		d: 100
	} as const

	const players = await fetch('https://ch.tetr.io/api/users/lists/league/all')
		.then(async response => {
			return await response.json() as {
				readonly data: {
					readonly users: {
						readonly _id: string
						readonly username: string

						readonly league: {
							readonly rank: string
							readonly rating: number

							readonly apm: number
							readonly pps: number
							readonly vs: number
						}
					}[]
				}
			}
		})
		.then(result => {
			return result.data.users
		})

	for (const [rank, percentile] of Object.entries(rank_percentiles)) {
		const rank_players = players.filter(player => rank === player.league.rank)
		const position = Math.floor((percentile / 100) * players.length) - 1

		const createLeaderboard = (prop: keyof typeof players[-1]['league']) => {
			return pipe(
				rank_players,
				sortBy((player: typeof players[-1]) => {
					return Number(player.league[prop])
				}),
				filter((player: typeof players[-1]) => {
					return isDefined(player.league[prop])
				})
			)
		}

		const createAverage = (prop: keyof typeof players[-1]['league']) => {
			return pipe(
				createLeaderboard(prop),
				sumBy((player: typeof players[-1]) => {
					return Number(player.league[prop])
				}),
				(value: number) => value / rank_players.length
			)
		}

		const apm_leaderboard = createLeaderboard('apm')
		const pps_leaderboard = createLeaderboard('pps')
		const vs_leaderboard = createLeaderboard('vs')

		const minimum_apm_player = first(apm_leaderboard)
		const minimum_pps_player = first(pps_leaderboard)
		const minimum_vs_player = first(vs_leaderboard)

		if (!isDefined(minimum_apm_player) || !isDefined(minimum_pps_player) || !isDefined(minimum_vs_player)) {
			continue
		}

		const maximum_apm_player = last(apm_leaderboard)
		const maximum_pps_player = last(pps_leaderboard)
		const maximum_vs_player = last(vs_leaderboard)

		if (!isDefined(maximum_apm_player) || !isDefined(maximum_pps_player) || !isDefined(maximum_vs_player)) {
			continue
		}

		results.push(
			await supabase.from('tetrio_ranks')
				.insert({
					name: rank,
					player_count: rank_players.length,
					require_tr: players[position].league.rating,

					average_pps: createAverage('pps'),
					average_apm: createAverage('apm'),
					average_vs: createAverage('vs'),

					minimum_apm: minimum_apm_player.league.apm,
					minimum_apm_player_id: minimum_apm_player._id,
					minimum_apm_player_name: minimum_apm_player.username,

					minimum_pps: minimum_pps_player.league.pps,
					minimum_pps_player_id: minimum_pps_player._id,
					minimum_pps_player_name: minimum_pps_player.username,

					minimum_vs: minimum_vs_player.league.vs,
					minimum_vs_player_id: minimum_vs_player._id,
					minimum_vs_player_name: minimum_vs_player.username,

					maximum_apm: maximum_apm_player.league.apm,
					maximum_apm_player_id: maximum_apm_player._id,
					maximum_apm_player_name: maximum_apm_player.username,

					maximum_pps: maximum_pps_player.league.pps,
					maximum_pps_player_id: maximum_pps_player._id,
					maximum_pps_player_name: maximum_pps_player.username,

					maximum_vs: maximum_vs_player.league.vs,
					maximum_vs_player_id: maximum_vs_player._id,
					maximum_vs_player_name: maximum_vs_player.username,

					record_at: new Date().toLocaleString()
				})
		)
	}

	const record_ids = await supabase.from('tetrio_bindings')
		.select('tetrio_id')
		.then(result => {
			if (result.data === null) {
				return []
			}

			return map(result.data, prop('tetrio_id'))
		})

	for (const tetrio_id of record_ids) {
		const target_player = players.find(player => player._id === tetrio_id)

		if (target_player === undefined) {
			continue
		}

		results.push(
			await supabase.from('tetrio_players')
				.insert({
					id: target_player._id,
					name: target_player.username,

					tr: target_player.league.rating,
					apm: target_player.league.apm,
					pps: target_player.league.pps,
					vs: target_player.league.vs,

					record_at: new Date().toLocaleString()
				})
		)
	}

	return new Response(
		JSON.stringify({
			status: 200,
			data: results
		}),
		{
			headers: {
				'content-type': 'application/json'
			},
			status: 200
		}
	)
})