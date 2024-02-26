<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
import type TetrioRank from '~/models/TetrioRank'

const props = defineProps<{
	readonly record: TetrioRank
}>()

const color = asyncComputed(async () => {
	return `rgba(${await props.record.color},0.5)`
})
</script>

<template>
	<NuxtLink :to="(`/tetrio/ranks/${record.name.toLowerCase()}`)" class="no-underline">
		<n-card :style="{ '--color': color }"
				class="w-100 card" size="small">
			<n-flex align="center" justify="space-between">
				<n-popover>
					<template #trigger>
						<n-image :src="record.icon" :width="50"/>
					</template>

					{{ record.name }}
				</n-popover>

				<div class="fw-bold text-right leading-tight">
					<n-text>{{ record.require_tr.toFixed(2) }} TR</n-text>
					<br>
					<n-text>{{ record.player_count }} 玩家</n-text>
				</div>
			</n-flex>

			<div class='text-center'>
				<n-text :depth='3' class='text-lg'>{{ record.record_at.toLocaleString() }}</n-text>
			</div>
		</n-card>
	</NuxtLink>
</template>

<style scoped>
.card {
	@apply transition-(& duration-300);
	@apply bg-[var(--color)];
	@apply hover:(cursor-pointer scale-105) transition-transform;
}
</style>