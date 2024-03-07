<script lang="ts" setup>
import { useWindowSize, watchTriggerable } from '@vueuse/core'
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
import { merge } from 'remeda'
import type { PartialDeep } from 'type-fest'
import VChart, { THEME_KEY } from 'vue-echarts'

type ChartOption = ComposeOption<TitleComponentOption | TooltipComponentOption | LegendComponentOption | ToolboxComponentOption | GridComponentOption | LineSeriesOption>

const props = defineProps<{
	readonly option: PartialDeep<ChartOption>
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

const option = computed(() => {
	return merge({
		title: {
			text: '表'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: []
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			data: []
		},
		yAxis: {
			type: 'value',
			min: 'dataMin',
			max: 'dataMax'
		},
		series: []
	}, props.option)
})

const version = ref(0)
const $size = useWindowSize()

const updater = watchTriggerable([option, $size.width, $size.height], () => {
	version.value++
})

setTimeout(() => {
	updater.trigger()
}, 500)
</script>

<template>
	<div class="w-screen h-screen">
		<v-chart :key="version" :option="option"/>
	</div>
</template>