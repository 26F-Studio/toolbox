<script lang="ts" setup>
import { filter, first, groupBy, isNonNullish, isNullish, isNumber, map, merge, pipe, prop, unique } from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const ranks = await useSupabaseClient<Database>()
	.from('tetrio_ranks')
	.select()
	.eq('name', useRoute().params.rank)
	.then(response => {
		if (isNonNullish(response.error)) {
			throw createApplicationError(response.error)
		}

		if (isNullish(response.data)) {
			return
		}

		return response.data.map(record => {
			return new TetrioRank(record)
		})
	})

if (isNullish(ranks) || ranks.length <= 0) {
	throw createError({
		statusCode: 404,
		statusMessage: '段位不存在'
	})
}

const createChartOption = async (type: keyof TetrioRank) => {
	return {
		title: {
			text: type.toUpperCase()
		},
		legend: {
			data: pipe(
				ranks,
				map(prop('name')),
				unique()
			)
		},
		xAxis: {
			type: 'category',
			data: pipe(
				ranks,
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
				groupBy(ranks, prop('name'))
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

const trChartOption = merge(await createChartOption('require_tr'), {
	title: {
		text: 'TR'
	}
})

const playerChartOption = merge(await createChartOption('player_count'), {
	title: {
		text: '玩家'
	}
})
</script>

<template>
	<Transition mode="out-in" name="page">
		<n-flex v-if="ranks" vertical>
			<n-card class="sm:(w-3/5 mx-auto)" title="历史">
				<tetrio-ranks-history-viewer :records="ranks"/>
			</n-card>

			<n-flex justify="center">
				<Chart :option="trChartOption" class="lg:(!w-[40vw] !h-[50vh])"/>
				<Chart :option="playerChartOption" class="lg:(!w-[40vw] !h-[50vh])"/>
			</n-flex>
		</n-flex>

		<n-empty v-else/>
	</Transition>
</template>