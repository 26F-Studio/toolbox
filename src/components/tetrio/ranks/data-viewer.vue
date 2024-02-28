<script lang="ts" setup>
import { createReusableTemplate } from '@vueuse/core'
import type TetrioRank from '~/models/TetrioRank'

defineProps<{
	readonly record: TetrioRank
}>()

const [LimitDateViewerDefine, LimitDateViewer] = createReusableTemplate<{
	readonly type: string
}>()
</script>

<template>
	<LimitDateViewerDefine v-slot="{ type, title, detailed }">
		<n-descriptions :column="3" bordered label-placement="top">
			<template v-for="_ in ['apm', 'pps', 'vs']">
				<n-descriptions-item class="inline-block">
					<template #label>
						{{ { average: '平均', minimum: '最小', maximum: '最大' }[type] }}
						{{ _.toUpperCase() }}
					</template>

					<template v-if="(type !== 'average')">
						<n-popover>
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
					</template>

					<template v-else>
						<n-text>{{ record[`${type}_${_}`].toFixed(2) }}</n-text>
					</template>
				</n-descriptions-item>
			</template>
		</n-descriptions>
	</LimitDateViewerDefine>

	<n-flex justify="center">
		<LimitDateViewer type="average"/>
		<LimitDateViewer type="minimum"/>
		<LimitDateViewer type="maximum"/>
	</n-flex>
</template>