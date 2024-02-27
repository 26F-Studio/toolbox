<script lang="ts" setup>
import { asyncComputed, createReusableTemplate } from '@vueuse/core'
import type TetrioRank from '~/models/TetrioRank'

const props = withDefaults(
	defineProps<{
		readonly record: TetrioRank
		readonly detailed?: boolean
	}>(),
	{
		detailed: false
	}
)

const color = asyncComputed(async () => {
	return `rgba(${await props.record.color},0.5)`
})

const [LimitDateViewerDefine, LimitDateViewer] = createReusableTemplate<{
	readonly type: string
}>()
</script>

<template>
	<NuxtLink :to="(`/tetrio/ranks/${record.name.toLowerCase()}`)" class="no-underline">
		<n-card
			:class="{ 'min-w-100 transition-(& duration-300) hover:(cursor-pointer scale-105) transition-transform': !detailed }"
			:style="{ '--color': color }" class="card" size="small">
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
					<n-descriptions-item v-for="_ in ['apm', 'pps', 'vs']" class="inline-block">
						<template #label>
							{{ { average: '平均', minimum: '最小', maximum: '最大' }[type] }}
							{{ _.toUpperCase() }}
						</template>

						<n-popover v-if="(type !== 'average')">
							<template #trigger>
								<n-text type="info">
									{{ record[`${type}_${_}`].toFixed(2) }}
								</n-text>
							</template>

							<n-button :href="(`https://ch.tetr.io/u/${record[`${type}_${_}_player_id`]}`)" tag="a" text
									  type="primary">
								{{ record[`${type}_${_}_player_name`] }}
							</n-button>
						</n-popover>

						<n-text v-else>
							{{ record[`${type}_${_}`].toFixed(2) }}
						</n-text>
					</n-descriptions-item>
				</n-descriptions>
			</LimitDateViewerDefine>

			<n-flex justify="center">
				<LimitDateViewer v-if="detailed" type="average"/>
				<LimitDateViewer v-if="detailed" type="minimum"/>
				<LimitDateViewer v-if="detailed" type="maximum"/>
			</n-flex>

			<div class='text-center'>
				<n-text :depth='3' class='text-lg'>{{ record.record_at.toLocaleString() }}</n-text>
			</div>
		</n-card>
	</NuxtLink>
</template>

<style scoped>
.card {
	@apply bg-[var(--color)];
}
</style>