import type { Database } from '~/types/supabase'

export default class TetrioBind {
	constructor(readonly record: Database['public']['Tables']['tetrio_bindings']['Row']) {

	}

	get id() {
		return this.record.id
	}

	get tetrio_id() {
		return this.record.tetrio_id
	}

	get tetrio_name() {
		return this.record.tetrio_name
	}
}