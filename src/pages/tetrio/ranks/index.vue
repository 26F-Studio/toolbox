<script lang="ts" setup>
import { groupBy, isDefined, last, mapValues, pipe, prop, sortBy } from 'remeda'
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
	if (!isDefined(ranks)) {
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
			<tetrio-ranks-card v-for="record in latestRankRecord" :record="record"/>
		</n-flex>

		<tetrio-ranks-chart :records="ranks" title="TR"/>
	</n-flex>
</template>