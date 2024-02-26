<script lang="ts" setup>
import { asyncComputed, tryOnBeforeMount } from '@vueuse/core'
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
import { first, groupBy, map, pipe, prop, uniq } from 'remeda'
import VChart, { THEME_KEY } from 'vue-echarts'
import type TetrioRank from '~/models/TetrioRank'

const props = withDefaults(
	defineProps<{
		readonly records: TetrioRank[]
		readonly type?: 'tr' | 'player'
		readonly title: string
	}>(),
	{
		type: 'tr'
	}
)

use([
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	ToolboxComponent,
	GridComponent,
	LineChart,
	CanvasRenderer
])

const osTheme = useOsTheme()

tryOnBeforeMount(() => {
	if (osTheme.value === 'dark') {
		provide(THEME_KEY, 'dark')
	}
})

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
				map(prop('record_at')),
				map(date => {
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
		series: await Promise.all(
			Object.entries(
				groupBy(props.records, prop('name'))
			).map(async ([name, records]) => {
				return {
					type: 'line',
					name: name.toUpperCase(),
					data: records.map(record => {
						switch (props.type) {
							case 'tr':
								return record.require_tr.toFixed(2)
							case 'player':
								return record.player_count
						}
					}),
					endLabel: {
						show: true
					},
					itemStyle: {
						color: `rgb(${await first(records).color})`
					}
				} as LineSeriesOption
			})
		)
	} as ComposeOption<TitleComponentOption | TooltipComponentOption | LegendComponentOption | ToolboxComponentOption | GridComponentOption | LineSeriesOption>
})
</script>

<template>
	<div class="overflow-auto">
		<div class="mx-auto w-500 h-250">
			<v-chart :option="chart"/>
		</div>
	</div>
</template>