import { prominent } from 'color.js'
import type { Database } from '~/types/supabase'

export default class TetrioRank {
	constructor(readonly record: Database['public']['Tables']['tetrio_ranks']['Row']) {

	}

	get average_apm() {
		return this.record.average_apm
	}

	get average_pps() {
		return this.record.average_pps
	}

	get average_vs() {
		return this.record.average_vs
	}

	get maximum_apm() {
		return this.record.maximum_apm
	}

	get maximum_apm_player_id() {
		return this.record.maximum_apm_player_id
	}

	get maximum_apm_player_name() {
		return this.record.maximum_apm_player_name
	}

	get maximum_pps() {
		return this.record.maximum_pps
	}

	get maximum_pps_player_id() {
		return this.record.maximum_pps_player_id
	}

	get maximum_pps_player_name() {
		return this.record.maximum_pps_player_name
	}

	get maximum_vs() {
		return this.record.maximum_vs
	}

	get maximum_vs_player_id() {
		return this.record.maximum_vs_player_id
	}

	get maximum_vs_player_name() {
		return this.record.maximum_vs_player_name
	}

	get minimum_apm() {
		return this.record.minimum_apm
	}

	get minimum_apm_player_id() {
		return this.record.minimum_apm_player_id
	}

	get minimum_apm_player_name() {
		return this.record.minimum_apm_player_name
	}

	get minimum_pps() {
		return this.record.minimum_pps
	}

	get minimum_pps_player_id() {
		return this.record.minimum_pps_player_id
	}

	get minimum_pps_player_name() {
		return this.record.minimum_pps_player_name
	}

	get minimum_vs() {
		return this.record.minimum_vs
	}

	get minimum_vs_player_id() {
		return this.record.minimum_vs_player_id
	}

	get minimum_vs_player_name() {
		return this.record.minimum_vs_player_name
	}

	get name() {
		return this.record.name.toUpperCase()
	}

	get player_count() {
		return this.record.player_count
	}

	get record_at() {
		return new Date(`${this.record.record_at}Z`)
	}

	get require_tr() {
		return this.record.require_tr
	}

	get icon() {
		const filename = this.record.name?.replaceAll('-', 'm').replaceAll('+', 'p')
		return new URL(`/assets/ranks/${filename}.png`, import.meta.url).toString()
	}

	get color() {
		return prominent(this.icon).then(colors => colors[2])
	}
}