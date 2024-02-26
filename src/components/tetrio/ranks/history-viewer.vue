<script lang="ts" setup>
import { breakpointsTailwind, createReusableTemplate, useBreakpoints } from '@vueuse/core'
import { groupBy, last, pipe } from 'remeda'
import type TetrioRank from '~/models/TetrioRank'

const props = defineProps<{
	readonly records: TetrioRank[]
}>()

const group = computed(() => {
	return pipe(
		props.records,
		groupBy(record => {
			return record.record_at.toLocaleDateString()
		})
	)
})

const latest = computed(() => {
	return last(props.records)
})

const [LimitDateViewerDefine, LimitDateViewer] = createReusableTemplate<{
	readonly type: 'minimum' | 'maximum'
}>()

const breakpoints = useBreakpoints(breakpointsTailwind)

const isMobile = computed(() => {
	return breakpoints.isSmallerOrEqual('sm')
})

const placement = computed(() => {
	if (isMobile.value) {
		return 'top'
	}

	return 'left'
})
</script>

<template>
	<n-tabs :default-value="latest.record_at.toLocaleDateString()" :placement="placement" class="max-h-100"
			justify-content="center" type="line">
		<template v-for="(records, date) in group">
			<n-tab-pane :name="date.toString()" :tab="date">
				<n-tabs :default-value="latest.record_at.toString()" :placement="placement" class="h-full"
						justify-content="center" type="line">
					<template v-for="record in records">
						<n-tab-pane :name="record.record_at.toString()" :tab="record.record_at.toLocaleTimeString()">
							<n-flex :vertical="!isMobile" align="center" justify="center">
								<div class="fw-bold leading-tight">
									<n-text>{{ record.require_tr.toFixed(2) }} TR</n-text>
									<br>
									<n-text>{{ record.player_count }} 玩家</n-text>
								</div>

								<LimitDateViewerDefine v-slot="{ type }">
									<n-flex :size="0" vertical>
										<div v-for="_ in ['apm', 'pps', 'vs']" class="inline-block">
											<n-text>最小 {{ _.toUpperCase() }}: {{ record[`${type}_${_}`] }}</n-text>
											<n-text type="info">&nbsp;By&nbsp;</n-text>
											<n-button
												:href="(`https://ch.tetr.io/u/${record[`${type}_${_}_player_id`]}`)"
												tag="a" text type="primary">
												{{ record[`${type}_${_}_player_name`] }}
											</n-button>
										</div>
									</n-flex>
								</LimitDateViewerDefine>

								<n-flex :size="0" vertical>
									<n-text v-for="_ in ['apm', 'pps', 'vs']">
										平均 {{ _.toUpperCase() }}: {{ record[`average_${_}`].toFixed(2) }}
									</n-text>
								</n-flex>

								<LimitDateViewer type="minimum"/>
								<LimitDateViewer type="maximum"/>

								<n-text :depth='3' class='text-lg'>{{ record.record_at.toLocaleString() }}</n-text>
							</n-flex>
						</n-tab-pane>
					</template>
				</n-tabs>
			</n-tab-pane>
		</template>
	</n-tabs>
</template>