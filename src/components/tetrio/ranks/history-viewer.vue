<script lang="ts" setup>
import { groupBy, last } from 'remeda'
import type TetrioRank from '~/models/TetrioRank'

const props = defineProps<{
	readonly records: TetrioRank[]
}>()

const groupedRecords = computed(() => {
	return groupBy(props.records, record => {
		return record.record_at.toLocaleDateString()
	})
})

const latestRecordDate = computed(() => {
	return last(props.records)!.record_at
})
</script>

<template>
	<n-tabs :default-value="latestRecordDate.toLocaleDateString()" justify-content="center" type="line">
		<template v-for="(records, date) in groupedRecords">
			<n-tab-pane :name="date" :tab="date">
				<n-tabs :default-value="latestRecordDate.toString()" justify-content="center" type="line">
					<template v-for="record in records">
						<n-tab-pane :name="record.record_at.toString()" :tab="record.record_at.toLocaleTimeString()">
							<n-flex justify="center">
								<tetrio-ranks-card :record="record" class="text-center">
									<tetrio-ranks-data-viewer :record="record"/>
								</tetrio-ranks-card>
							</n-flex>
						</n-tab-pane>
					</template>
				</n-tabs>
			</n-tab-pane>
		</template>
	</n-tabs>
</template>