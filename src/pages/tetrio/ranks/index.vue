<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
import { first, groupBy, isDefined, last, map, mapValues, pipe, prop, sortBy, uniq } from 'remeda'
import TetrioRank from '~/models/TetrioRank'
import type { Database } from '~/types/supabase'

const ranks = await useSupabaseClient<Database>()
	.from('tetrio_ranks')
	.select()
	.then(response => {
		if (isDefined(response.error)) {
			throw createApplicationError(response.error)
		}

		return response.data?.map(record => {
			return new TetrioRank(record)
		})
	})

const latestRankRecord = computed(() => {
	if (!isDefined(ranks)) {
		return
	}

	return pipe(
		ranks,
		groupBy(prop('name')),
		mapValues(sortBy(prop('record_at'))),
		mapValues(last())
	)
})

const chartOption = asyncComputed(async () => {
	if (!isDefined(ranks)) {
		return
	}

	return {
		title: {
			text: 'TR'
		},
		legend: {
			data: pipe(
				ranks,
				map(prop('name')),
				uniq()
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
				uniq()
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
			<Chart v-if="isDefined(chartOption)" :option="chartOption"/>
			<n-spin v-else class="py-5"/>
		</Transition>
	</n-flex>
</template>