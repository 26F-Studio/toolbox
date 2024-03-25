<script lang="ts" setup>
import { tryOnMounted, until } from '@vueuse/core'
import { format, subDays, subHours } from 'date-fns/fp'
import {
	filter,
	first,
	groupBy,
	isNonNullish,
	isNullish,
	isNumber,
	map,
	merge,
	pipe,
	piped,
	prop,
	unique
} from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const route = useRoute()

const dataQueryDateRange = ref([
	pipe(
		new Date(),
		subDays(7),
		date => date.valueOf()
	),
	Date.now()
])

const ranks = useAsyncData(async () => {
	const [startDate, endDate] = dataQueryDateRange.value

	const processDate = piped(
		subHours(8),
		format('yyyy/MM/dd HH:mm:ss')
	)

	return await useSupabaseClient<Database>()
		.from('tetrio_ranks')
		.select()
		.gte('record_at', processDate(startDate))
		.lte('record_at', processDate(endDate))
		.eq('name', route.params.rank)
		.then(response => {
			if (isNonNullish(response.error)) {
				throw createApplicationError(response.error)
			}

			return response.data?.map(record => {
				return new TetrioRank(record)
			})
		})
}, {
	watch: [dataQueryDateRange],
	immediate: true
})

const createChartOption = async (type: keyof TetrioRank) => {
	if (isNullish(ranks.data.value)) {
		return
	}

	return {
		title: {
			text: type.toUpperCase()
		},
		legend: {
			data: pipe(
				ranks.data.value,
				map(prop('name')),
				unique()
			)
		},
		xAxis: {
			type: 'category',
			data: pipe(
				ranks.data.value,
				map(prop('record_at')),
				map(date => {
					date.setMinutes(0)
					date.setSeconds(0)

					return date.toLocaleString()
				}),
				unique()
			)
		},
		series: await Promise.all(
			Object.entries(
				groupBy(ranks.data.value, prop('name'))
			).map(async ([name, records]) => {
				return {
					type: 'line',
					name: name.toUpperCase(),
					data: pipe(
						records,
						map(prop(type)),
						filter(isNumber),
						map(value => value.toFixed(2))
					),
					endLabel: {
						show: true
					},
					itemStyle: {
						color: `rgb(${await first(records)?.color})`
					}
				}
			})
		)
	}
}

const trChartOption = useAsyncData(async () => {
	return merge(await createChartOption('require_tr'), {
		title: {
			text: 'TR'
		}
	})
}, {
	watch: [ranks.data],
	immediate: true
})

const playerChartOption = useAsyncData(async () => {
	return merge(await createChartOption('player_count'), {
		title: {
			text: '玩家'
		}
	})
}, {
	watch: [ranks.data],
	immediate: true
})

tryOnMounted(async () => {
	await until(ranks.pending).toBe(false)

	if (isNullish(ranks.data.value) || ranks.data.value.length <= 0) {
		throw createError({
			statusCode: 404,
			statusMessage: '段位不存在'
		})
	}
})
</script>

<template>
	<Transition mode="out-in" name="page">
		<n-flex vertical>
			<div class="w-1/2 mx-auto">
				<n-date-picker v-model:value="dataQueryDateRange" clearable type="datetimerange"/>
			</div>

			<template v-if="!ranks.pending.value">
				<template v-if="isNonNullish(ranks.data.value)">
					<n-card class="sm:(w-3/5 mx-auto)" title="历史">
						<tetrio-ranks-history-viewer :records="ranks.data.value"/>
					</n-card>

					<n-flex justify="center">
						<template v-if="!trChartOption.pending.value && !playerChartOption.pending.value">
							<Chart :option="trChartOption.data.value" class="lg:(!w-[40vw] !h-[50vh])"/>
							<Chart :option="playerChartOption.data.value" class="lg:(!w-[40vw] !h-[50vh])"/>
						</template>

						<n-spin v-else class="py-5"/>
					</n-flex>
				</template>

				<n-empty v-else/>
			</template>

			<n-spin v-else class="py-5"/>
		</n-flex>
	</Transition>
</template>