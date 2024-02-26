<script lang="ts" setup>
import { tryOnBeforeMount } from '@vueuse/core'
import { isDefined } from 'remeda'
import HistoryViewer from '~/components/tetrio/ranks/history-viewer.vue'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

definePageMeta({
	validate: async route => {
		return await useSupabaseClient<Database>()
			.from('tetrio_ranks')
			.select()
			.eq('name', route.params.rank)
			.then(result => {
				return isDefined(result.data) && result.data.length > 0
			})
	}
})

const supabase = useSupabaseClient<Database>()
const route = useRoute()

const ranks = ref<TetrioRank[]>()

tryOnBeforeMount(async () => {
	ranks.value = await supabase.from('tetrio_ranks')
		.select()
		.eq('name', route.params.rank)
		.then(result => {
			return result.data?.map(record => {
				return new TetrioRank(record)
			})
		})
})
</script>

<template>
	<n-flex v-if="ranks" vertical>
		<n-card title="历史">
			<history-viewer :records="ranks"/>
		</n-card>

		<tetrio-ranks-chart :records="ranks" title="TR"/>
		<tetrio-ranks-chart :records="ranks" title="人数" type="player"/>
	</n-flex>
</template>