<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { isDefined } from 'remeda'
import { isEmpty } from 'remeda/dist/es'
import type TetrioBind from '~/models/TetrioBind'
import type { Database } from '~/types/supabase'

const props = defineProps<{
	readonly record: TetrioBind
}>()

const $emits = defineEmits<{
	readonly bound: []
}>()

const name = ref(props.record?.tetrio_name)

watch(() => props.record, newRecord => {
	if (isDefined(newRecord)) {
		name.value = newRecord.tetrio_name
	}
})

const waiting = ref(false)

const available = computed(() => {
	return isEmpty(props.record?.tetrio_name) && !isEmpty(name.value) && !waiting.value
})

const supabase = useSupabaseClient<Database>()
const $message = useMessage()

const save = async () => {
	try {
		waiting.value = true

		if (!isDefined(name.value)) {
			throw createApplicationError('请输入用户名')
		}

		const user = await getUser()
		const profile = await invokeTetrioProfile(name.value)

		const already_used = await supabase.from('tetrio_bindings')
			.select()
			.eq('tetrio_id', profile.id)
			.limit(1)
			.then(response => {
				if (isDefined(response.error)) {
					throw createApplicationError(response.error)
				}

				return isDefined(response.data) && !isEmpty(response.data)
			})

		if (already_used) {
			$message.error('这个用户名已经被其他人绑定了')
			return
		}

		await supabase.from('tetrio_bindings')
			.upsert({
				id: user.id,
				tetrio_id: profile.id,
				tetrio_name: name.value
			})
			.then(response => {
				if (isDefined(response.error)) {
					throw createApplicationError(response.error)
				}

				$emits('bound')
			})
	} finally {
		waiting.value = false
	}
}

const bound = computed(() => {
	return isDefined(props.record)
})
</script>

<template>
	<n-card size="small" title="账号绑定">
		<n-flex :size="0" class="leading-tight" vertical>
			<n-input v-model:value="name" :disabled="bound" placeholder="tetr.io 用户名"/>
			<n-text :depth="3" class="text-sm">{{ props.record?.tetrio_id }}</n-text>
		</n-flex>

		<template #action>
			<Transition mode="out-in" name="page">
				<n-flex justify="end">
					<n-button v-if="!bound" :disabled="!available" :loading="waiting" @click="save">保存</n-button>

					<n-flex v-else :size="5" justify="end">
						<n-text>如需更改绑定请联系</n-text>
						<n-button href="https://zhazha120.cn" tag="a" text type="primary">渣渣120</n-button>
					</n-flex>
				</n-flex>
			</Transition>
		</template>
	</n-card>
</template>