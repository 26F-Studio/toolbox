<script lang="ts" setup>
import { groupBy, last } from 'remeda'
import type TetrioRank from '~/models/TetrioRank'

defineProps<{
	readonly records: TetrioRank[]
}>()
</script>

<template>
	<n-tabs :default-value="last(records).record_at.toLocaleDateString()" justify-content="center" type="line">
		<n-tab-pane v-for="(records, date) in groupBy(records, record => record.record_at.toLocaleDateString())"
					:name="date.toString()"
					:tab="date">
			<n-tabs :default-value="last(records).record_at.toString()" class="h-full" justify-content="center"
					type="line">
				<n-tab-pane v-for="record in records" :name="record.record_at.toString()"
							:tab="record.record_at.toLocaleTimeString()">
					<n-flex justify="center">
						<tetrio-ranks-card :record="record" class="text-center" detailed/>
					</n-flex>
				</n-tab-pane>
			</n-tabs>
		</n-tab-pane>
	</n-tabs>
</template>