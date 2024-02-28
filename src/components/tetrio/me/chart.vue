<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
import { LineChart, type LineSeriesOption } from 'echarts/charts'
import {
	GridComponent,
	type GridComponentOption,
	LegendComponent,
	type LegendComponentOption,
	TitleComponent,
	type TitleComponentOption,
	ToolboxComponent,
	type ToolboxComponentOption,
	TooltipComponent,
	type TooltipComponentOption
} from 'echarts/components'
import { type ComposeOption, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useOsTheme } from 'naive-ui'
import { map, pipe, prop, uniq } from 'remeda'
import VChart, { THEME_KEY } from 'vue-echarts'
import type { Database } from '~/types/supabase'

const props = defineProps<{
	readonly name: string
	readonly records: Database['public']['Tables']['tetrio_players']['Row'][]
	readonly type: 'tr' | 'apm' | 'pps' | 'vs'
	readonly title: string
}>()

use([
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	ToolboxComponent,
	GridComponent,
	LineChart,
	CanvasRenderer
])

if (useOsTheme().value === 'dark') {
	provide(THEME_KEY, 'dark')
}

const chart = asyncComputed(async () => {
	return {
		title: {
			text: props.title
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: pipe(
				props.records,
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
				props.records,
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
			name: props.name,
			data: map(props.records, record => {
				return record[props.type].toFixed(2)
			}),
			endLabel: {
				show: true
			}
		} as LineSeriesOption
	} as ComposeOption<TitleComponentOption | TooltipComponentOption | LegendComponentOption | ToolboxComponentOption | GridComponentOption | LineSeriesOption>
})
</script>

<template>
	<div class="overflow-auto">
		<div class="mx-auto w-300 h-250">
			<v-chart :option="chart"/>
		</div>
	</div>
</template>