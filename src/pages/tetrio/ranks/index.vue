<script lang="ts" setup>
import { groupBy, last, mapValues, pipe, prop, sortBy } from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const ranks = await useSupabaseClient<Database>()
	.from('tetrio_ranks')
	.select()
	.then(result => {
		return result.data?.map(record => {
			return new TetrioRank(record)
		})
	})

const latestRankRecord = computed(() => {
	if (ranks === undefined) {
		return
	}

	return pipe(
		ranks,
		groupBy(prop('name')),
		mapValues(sortBy(prop('record_at'))),
		mapValues(last())
	)
})
</script>

<template>
	<n-flex vertical>
		<n-flex justify='center'>
			<template v-for="record in latestRankRecord">
				<NuxtLink :to="{ name: 'tetrio-ranks-rank', params: { rank: record.name.toLowerCase() } }"
						  class="no-underline">
					<tetrio-ranks-card :record="record" class="w-100 transition-transform hover:scale-105"/>
				</NuxtLink>
			</template>
		</n-flex>

		<tetrio-ranks-chart :records="ranks" title="TR"/>
	</n-flex>
</template>