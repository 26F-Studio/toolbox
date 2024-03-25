<script lang="ts" setup>
import { asyncComputed, createReusableTemplate } from '@vueuse/core'
import { isNonNullish } from 'remeda'
import type TetrioRank from '~/models/TetrioRank'

const props = defineProps<{
	readonly record: TetrioRank
}>()

const [LimitDateViewerDefine, LimitDateViewer] = createReusableTemplate<{
	readonly type: string
}>()

const color = asyncComputed(async () => {
	return `rgba(${await props.record.color},0.5)`
})
</script>

<template>
	<n-card :style="{ '--color': color }" class="transition-(& duration-300) bg-[var(--color)]" size="small">
		<n-flex align="center" justify="space-between">
			<n-popover>
				<template #trigger>
					<n-image :src="record.icon" :width="50"/>
				</template>

				{{ record.name }}
			</n-popover>

			<div class="fw-bold text-right leading-tight">
				<n-text>{{ record.require_tr.toFixed(2) }} TR</n-text>
				<br>
				<n-text>{{ record.player_count }} 玩家</n-text>
			</div>
		</n-flex>

		<LimitDateViewerDefine v-slot="{ type, title, detailed }">
			<n-descriptions :column="3" bordered label-placement="top">
				<template v-for="_ in ['apm', 'pps', 'vs']">
					<n-descriptions-item class="inline-block">
						<template #label>
							{{ { average: '平均', minimum: '最小', maximum: '最大' }[type] }}
							{{ _.toUpperCase() }}
						</template>

						<n-popover
							v-if="isNonNullish(record[`${type}_${_}_player_id`]) && isNonNullish(record[`${type}_${_}_player_name`])">
							<template #trigger>
								<n-text class="cursor-pointer" type="info">
									{{ record[`${type}_${_}`].toFixed(2) }}
								</n-text>
							</template>

							<n-button :href="(`https://ch.tetr.io/u/${record[`${type}_${_}_player_id`]}`)" tag="a"
									  text type="primary">
								{{ record[`${type}_${_}_player_name`] }}
							</n-button>
						</n-popover>

						<n-text v-else>{{ record[`${type}_${_}`].toFixed(2) }}</n-text>
					</n-descriptions-item>
				</template>
			</n-descriptions>
		</LimitDateViewerDefine>

		<n-flex justify="center">
			<LimitDateViewer type="average"/>
			<LimitDateViewer type="minimum"/>
			<LimitDateViewer type="maximum"/>
		</n-flex>

		<div class='text-center'>
			<n-text :depth='3' class='text-lg'>{{ record.record_at.toLocaleString() }}</n-text>
		</div>
	</n-card>
</template>