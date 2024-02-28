<script lang="ts" setup>
import { isDefined } from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

definePageMeta({
	validate: async route => {
		return await useSupabaseClient<Database>()
			.from('tetrio_ranks')
			.select('name')
			.limit(1)
			.eq('name', route.params.rank)
			.then(result => {
				return isDefined(result.data) && result.data.length > 0
			})
	}
})

const ranks = await useSupabaseClient<Database>()
	.from('tetrio_ranks')
	.select()
	.eq('name', useRoute().params.rank)
	.then(result => {
		return result.data?.map(record => {
			return new TetrioRank(record)
		})
	})
</script>

<template>
	<n-flex v-if="ranks" vertical>
		<n-card class="sm:(w-3/5 mx-auto)" title="历史">
			<tetrio-ranks-history-viewer :records="ranks"/>
		</n-card>

		<tetrio-ranks-chart :records="ranks" title="TR"/>
		<tetrio-ranks-chart :records="ranks" title="人数" type="player"/>
	</n-flex>
</template>