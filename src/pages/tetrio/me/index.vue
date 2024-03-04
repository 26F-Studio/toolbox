<script lang="ts" setup>
import { asyncComputed, tryOnBeforeMount } from '@vueuse/core'
import { addHours } from 'date-fns'
import type { LineSeriesOption } from 'echarts/charts'
import { filter, first, isDefined, isNumber, map, pipe, prop, uniq } from 'remeda'
import TetrioBind from '~/models/TetrioBind'
import TetrioRecord from '~/models/TetrioRecord'
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()

const binding = ref<TetrioBind>()
const bindingLoading = ref(false)

const records = asyncComputed(async () => {
	if (!isDefined(binding.value)) {
		return
	}

	return await supabase.from('tetrio_players')
		.select()
		.eq('id', binding.value.tetrio_id)
		.then(response => {
			if (isDefined(response.error)) {
				throw createApplicationError(response.error)
			}

			return response.data?.map(record => {
				return new TetrioRecord(record)
			})
		})
})

const updateBinding = async () => {
	try {
		bindingLoading.value = true
		const user = await getUser()

		await supabase.from('tetrio_bindings')
			.select()
			.eq('id', user.id)
			.then(response => {
				if (isDefined(response.error)) {
					throw createApplicationError(response.error)
				}

				if (!isDefined(response.data)) {
					return
				}

				return first(response.data)
			})
			.then(record => {
				if (!isDefined(record)) {
					return
				}

				binding.value = new TetrioBind(record)
			})
	} finally {
		bindingLoading.value = false
	}
}

const createChartOption = (type: keyof TetrioRecord) => {
	if (!isDefined(records.value)) {
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
				records.value,
				map(prop('name')),
				uniq()
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
				records.value,
				map(record => {
					const date = new Date(record.record_at)

					date.setMinutes(0)
					date.setSeconds(0)

					return date.toLocaleString()
				}),
				uniq()
			)
		},
		yAxis: {
			type: 'value',
			min: 'dataMin',
			max: 'dataMax'
		},
		series: {
			type: 'line',
			name: first(records.value)?.name ?? '未知',
			data: pipe(
				records.value,
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

tryOnBeforeMount(() => {
	updateBinding()
})
</script>

<template>
	<n-flex vertical>
		<n-flex justify="center">
			<n-spin :show="bindingLoading" class="sm:w-1/2">
				<tetrio-me-bound :record="binding" @bound="updateBinding"/>
			</n-spin>
		</n-flex>

		<Transition mode="out-in" name="page">
			<template v-if="binding">
				<n-flex v-if="isDefined(records)" justify="center">
					<Chart :option="createChartOption('tr')" class="lg:(!w-[40vw] !h-[50vh])"/>
					<Chart :option="createChartOption('apm')" class="lg:(!w-[40vw] !h-[50vh])"/>
					<Chart :option="createChartOption('pps')" class="lg:(!w-[40vw] !h-[50vh])"/>
					<Chart :option="createChartOption('vs')" class="lg:(!w-[40vw] !h-[50vh])"/>
				</n-flex>

				<n-empty v-else class="py-10">
					<n-text class="text-current text-xl">
						当前没有记录数据, 预计在 {{ addHours(new Date(), 1).getHours() }}:00 开始第一次记录
					</n-text>
				</n-empty>
			</template>

			<n-spin v-else class="py-5"/>
		</Transition>
	</n-flex>
</template>