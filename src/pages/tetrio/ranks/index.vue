<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
import { format, subDays, subHours } from 'date-fns/fp'
import {
	first,
	groupBy,
	isNonNullish,
	isNullish,
	last,
	map,
	mapValues,
	pipe,
	piped,
	prop,
	sortBy,
	unique
} from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const dataQueryDateRange = ref([
	pipe(
		new Date(),
		subDays(3),
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

const latestRankRecord = computed(() => {
	if (isNullish(ranks.data.value)) {
		return
	}

	return pipe(
		ranks.data.value,
		groupBy(prop('name')),
		mapValues(sortBy(prop('record_at'))),
		mapValues(last())
	)
})

const chartOption = asyncComputed(async () => {
	if (isNullish(ranks.data.value)) {
		return
	}

	return {
		title: {
			text: 'TR'
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
						map(prop('require_tr')),
						map(value => value.toFixed(2))
					),
					endLabel: {
						show: true
					},
					itemStyle: {
						color: `rgb(${await first(records).color})`
					}
				}
			})
		)
	}
})
</script>

<template>
	<n-flex vertical>
		<div class="w-1/2 mx-auto">
			<n-date-picker v-model:value="dataQueryDateRange" clearable type="datetimerange"/>
		</div>

		<template v-if="!ranks.pending.value">
			<n-flex justify='center'>
				<template v-for="record in latestRankRecord">
					<NuxtLink :to="{
					name: 'tetrio-ranks-rank',
					params: {
						rank: record.name.toLowerCase()
					}
				}" class="no-underline">
						<tetrio-ranks-card :record="record"
										   class="w-100 transition-transform hover:scale-105 [&_.n-descriptions]:hidden"/>
					</NuxtLink>
				</template>
			</n-flex>

			<Transition mode="out-in" name="page">
				<n-flex v-if="isNonNullish(chartOption)" vertical>
					<Chart :option="chartOption"/>
				</n-flex>
			</Transition>
		</template>

		<n-spin v-else class="py-5"/>
	</n-flex>
</template>