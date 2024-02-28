<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { isEmpty } from 'remeda/dist/es'
import type { Database } from '~/types/supabase'

const props = defineProps<{
	readonly id?: string
	readonly name?: string
}>()

const name = ref<string>(props.name ?? '')
const waiting = ref(false)

const available = computed(() => {
	return isEmpty(props.name) && !isEmpty(name.value) && !waiting.value
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const $message = useMessage()

const save = async () => {
	waiting.value = true

	if (user.value === null) {
		$message.error('请先登录')
		return
	}

	const already_used = await supabase.from('tetrio_bindings')
		.select()
		.eq('tetrio_name', name.value)
		.then(result => {
			if (result.error !== null) {
				$message.error('发生了一个错误, 请到控制台查看')
				console.error(result.error)
			}

			if (result.data === null) {
				return false
			}

			return result.data.length > 0
		})

	if (already_used) {
		$message.error('这个用户名已经被其他人绑定了')
		return
	}

	const result = await supabase.functions.invoke('tetrio_profile', {
		method: 'POST',
		body: JSON.stringify({
			name: name.value
		})
	})

	if (result.error !== null) {
		$message.error('发生了一个错误, 请到控制台查看')
		console.error(result.error)
	}

	if (result.data !== null && 'data' in result.data) {
		await supabase.from('tetrio_bindings')
			.upsert({
				id: user.value.id,
				tetrio_id: result.data.data.id,
				tetrio_name: name.value
			})
			.then(result => {
				if (result.error !== null) {
					$message.error('发生了一个错误, 请到控制台查看')
					console.error(result.error)
				}
			})
	}

	waiting.value = false
}

const bound = computed(() => {
	return !isEmpty(props.id) && !isEmpty(props.name)
})
</script>

<template>
	<n-card class="sm:w-1/2" size="small" title="账号绑定">
		<template v-if="!bound">
			<n-flex :size="0" class="leading-tight" vertical>
				<n-input v-model:value="name" :disabled="props.name !== undefined" placeholder="tetr.io 用户名"/>
				<n-text :depth="3" class="text-sm">{{ id }}</n-text>
			</n-flex>

		</template>

		<template v-else>
			<n-flex :size="0" class="text-center leading-tight" vertical>
				<n-text class="text-2xl fw-bold">{{ name }}</n-text>
				<n-text :depth="3" class="text-xl fw-bold">{{ id }}</n-text>
			</n-flex>
		</template>

		<template #action>
			<n-flex justify="end">
				<template v-if="!bound">
					<n-button :disabled="!available" :loading="waiting" @click="save">保存</n-button>
				</template>

				<template v-else>
					<n-flex :size="5" justify="end">
						<n-text>如需更改绑定请联系</n-text>
						<n-button href="https://zhazha120.cn" tag="a" text type="primary">渣渣120</n-button>
					</n-flex>
				</template>
			</n-flex>
		</template>
	</n-card>
</template>