export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			tetrio_bindings: {
				Row: {
					id: string
					tetrio_id: string
					tetrio_name: string
				}
				Insert: {
					id: string
					tetrio_id: string
					tetrio_name: string
				}
				Update: {
					id?: string
					tetrio_id?: string
					tetrio_name?: string
				}
				Relationships: [
					{
						foreignKeyName: 'tetrio_bindings_id_fkey'
						columns: ['id']
						isOneToOne: true
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			tetrio_players: {
				Row: {
					apm: number
					id: string
					name: string
					pps: number
					record_at: string
					tr: number
					vs: number
				}
				Insert: {
					apm: number
					id: string
					name: string
					pps: number
					record_at: string
					tr: number
					vs: number
				}
				Update: {
					apm?: number
					id?: string
					name?: string
					pps?: number
					record_at?: string
					tr?: number
					vs?: number
				}
				Relationships: []
			}
			tetrio_ranks: {
				Row: {
					average_apm: number
					average_pps: number
					average_vs: number
					maximum_apm: number
					maximum_apm_player_id: string
					maximum_apm_player_name: string
					maximum_pps: number
					maximum_pps_player_id: string
					maximum_pps_player_name: string
					maximum_vs: number
					maximum_vs_player_id: string
					maximum_vs_player_name: string
					minimum_apm: number
					minimum_apm_player_id: string
					minimum_apm_player_name: string
					minimum_pps: number
					minimum_pps_player_id: string
					minimum_pps_player_name: string
					minimum_vs: number
					minimum_vs_player_id: string
					minimum_vs_player_name: string
					name: string
					player_count: number
					record_at: string
					require_tr: number
				}
				Insert: {
					average_apm: number
					average_pps: number
					average_vs: number
					maximum_apm: number
					maximum_apm_player_id: string
					maximum_apm_player_name: string
					maximum_pps: number
					maximum_pps_player_id: string
					maximum_pps_player_name: string
					maximum_vs: number
					maximum_vs_player_id: string
					maximum_vs_player_name: string
					minimum_apm: number
					minimum_apm_player_id: string
					minimum_apm_player_name: string
					minimum_pps: number
					minimum_pps_player_id: string
					minimum_pps_player_name: string
					minimum_vs: number
					minimum_vs_player_id: string
					minimum_vs_player_name: string
					name: string
					player_count: number
					record_at: string
					require_tr: number
				}
				Update: {
					average_apm?: number
					average_pps?: number
					average_vs?: number
					maximum_apm?: number
					maximum_apm_player_id?: string
					maximum_apm_player_name?: string
					maximum_pps?: number
					maximum_pps_player_id?: string
					maximum_pps_player_name?: string
					maximum_vs?: number
					maximum_vs_player_id?: string
					maximum_vs_player_name?: string
					minimum_apm?: number
					minimum_apm_player_id?: string
					minimum_apm_player_name?: string
					minimum_pps?: number
					minimum_pps_player_id?: string
					minimum_pps_player_name?: string
					minimum_vs?: number
					minimum_vs_player_id?: string
					minimum_vs_player_name?: string
					name?: string
					player_count?: number
					record_at?: string
					require_tr?: number
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

export type Tables<
	PublicTableNameOrOptions extends | keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
		Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
			Database['public']['Views'])
		? (Database['public']['Tables'] &
			Database['public']['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	PublicTableNameOrOptions extends | keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	PublicTableNameOrOptions extends | keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	PublicEnumNameOrOptions extends | keyof Database['public']['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
		? Database['public']['Enums'][PublicEnumNameOrOptions]
		: never
