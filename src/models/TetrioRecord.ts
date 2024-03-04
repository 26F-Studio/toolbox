import type { Database } from '~/types/supabase'

export default class TetrioRecord {
	constructor(readonly record: Database['public']['Tables']['tetrio_players']['Row']) {

	}

	get id() {
		return this.record.id
	}

	get name() {
		return this.record.name
	}

	get apm() {
		return this.record.apm
	}

	get pps() {
		return this.record.pps
	}

	get vs() {
		return this.record.vs
	}

	get tr() {
		return this.record.tr
	}

	get record_at() {
		return new Date(`${this.record.record_at}Z`)
	}
}