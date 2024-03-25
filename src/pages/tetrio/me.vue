<script lang="ts" setup>
import { addHours } from 'date-fns'
import type { LineSeriesOption } from 'echarts/charts'
import { filter, first, isNonNullish, isNullish, isNumber, map, pipe, prop, unique } from 'remeda'
import { isEmpty } from 'remeda/dist/es'
import TetrioBind from '~/models/TetrioBind'
import TetrioRecord from '~/models/TetrioRecord'
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()

const binding = useAsyncData(async () => {
	const user = await getUser()

	return await supabase.from('tetrio_bindings')
		.select()
		.eq('id', user.id)
		.then(response => {
			if (isNonNullish(response.error)) {
				throw createApplicationError(response.error)
			}

			if (isNullish(response.data)) {
				return
			}

			return first(response.data)
		})
		.then(record => {
			if (isNullish(record)) {
				return
			}

			return new TetrioBind(record)
		})
}, {
	server: false
})

const records = useLazyAsyncData(async () => {
	if (isNullish(binding.data.value)) {
		return
	}

	return await supabase.from('tetrio_players')
		.select()
		.eq('id', binding.data.value.tetrio_id)
		.then(response => {
			if (isNonNullish(response.error)) {
				throw createApplicationError(response.error)
			}

			if (isNullish(response.data)) {
				return
			}

			return response.data.map(record => {
				return new TetrioRecord(record)
			})
		})
}, {
	server: false,
	watch: [binding.data]
})

const createChartOption = (type: keyof TetrioRecord) => {
	if (isNullish(records.data.value)) {
		return
	}

	return {
		title: {
			text: type.toUpperCase()
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: pipe(
				records.data.value,
				map(prop('name')),
				unique()
			)
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			data: pipe(
				records.data.value,
				map(record => {
					const date = new Date(record.record_at)

					date.setMinutes(0)
					date.setSeconds(0)

					return date.toLocaleString()
				}),
				unique()
			)
		},
		yAxis: {
			type: 'value',
			min: 'dataMin',
			max: 'dataMax'
		},
		series: {
			type: 'line',
			name: first(records.data.value)?.name ?? '未知',
			data: pipe(
				records.data.value,
				map(prop(type)),
				filter(isNumber),
				map(value => value.toFixed(2))
			),
			endLabel: {
				show: true
			}
		} as LineSeriesOption
	}
}
</script>

<template>
	<n-flex vertical>
		<n-flex justify="center">
			<n-spin :show="binding.pending.value" class="sm:w-1/2">
				<tetrio-me-bound :record="binding.data.value" @bound="binding.refresh"/>
			</n-spin>
		</n-flex>

		<Transition mode="out-in" name="page">
			<template v-if="!binding.pending.value">
				<template v-if="!records.pending.value">
					<n-flex v-if="!isEmpty(records.data.value)" class="[&>div]:lg:(!w-[48vw] !h-[50vh])"
							justify="center">
						<Chart :option="createChartOption('tr')"/>
						<Chart :option="createChartOption('apm')"/>
						<Chart :option="createChartOption('pps')"/>
						<Chart :option="createChartOption('vs')"/>
					</n-flex>

					<n-empty v-else class="py-10">
						<n-text class="text-current text-xl">
							当前没有记录数据, 预计在 {{ addHours(new Date(), 1).getHours() }}:00 开始第一次记录
						</n-text>
					</n-empty>
				</template>

				<n-spin v-else class="py-5"/>
			</template>

			<n-spin v-else class="py-5"/>
		</Transition>
	</n-flex>
</template>