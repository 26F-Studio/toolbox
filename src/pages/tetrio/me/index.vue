<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { first } from 'remeda'
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const $message = useMessage()

const binding = await (async () => {
	if (user.value === null) {
		$message.error('请先登录')
		return
	}

	return await supabase.from('tetrio_bindings')
		.select()
		.eq('id', user.value.id)
		.then(result => {
			if (result.error !== null) {
				$message.error('发生了一个错误, 请到控制台查看')
				console.error(result.error)
			}

			if (result.data === null) {
				return
			}

			return first(result.data)
		})
})()

const records = await (async () => {
	if (binding === undefined) {
		return []
	}

	return await supabase.from('tetrio_players')
		.select()
		.eq('id', binding.tetrio_id)
		.then(result => {
			if (result.error !== null) {
				$message.error('发生了一个错误, 请到控制台查看')
				console.error(result.error)
			}

			if (result.data === null) {
				return []
			}

			return result.data
		})
})()
</script>

<template>
	<n-flex vertical>
		<n-flex justify="center">
			<template v-if="binding !== undefined">
				<tetrio-me-bound :id="binding.tetrio_id" :name="binding.tetrio_name"/>
			</template>

			<template v-else>
				<tetrio-me-bound/>
			</template>
		</n-flex>

		<n-flex justify="center">
			<tetrio-me-chart :name="binding.tetrio_name" :records="records" title="TR" type="tr"/>
			<tetrio-me-chart :name="binding.tetrio_name" :records="records" title="APM" type="apm"/>
			<tetrio-me-chart :name="binding.tetrio_name" :records="records" title="PPS" type="pps"/>
			<tetrio-me-chart :name="binding.tetrio_name" :records="records" title="VS" type="vs"/>
		</n-flex>
	</n-flex>
</template>