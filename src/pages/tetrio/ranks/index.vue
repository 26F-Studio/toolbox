<script lang="ts" setup>
import { tryOnBeforeMount } from '@vueuse/core'
import { groupBy, isDefined, last, mapValues, pipe, prop, sortBy } from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()
const ranks = ref<TetrioRank[]>()

tryOnBeforeMount(async () => {
	ranks.value = await supabase.from('tetrio_ranks').select()
		.then(result => {
			return result.data?.map(record => {
				return new TetrioRank(record)
			})
		})
})

const latestRankRecord = computed(() => {
	if (!isDefined(ranks.value)) {
		return
	}

	return pipe(
		ranks.value,
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
				<tetrio-ranks-card :record="record"/>
			</template>
		</n-flex>

		<tetrio-ranks-chart :records="ranks" title="TR"/>
	</n-flex>
</template>