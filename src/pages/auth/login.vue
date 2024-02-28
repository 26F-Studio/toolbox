<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { isDefined } from 'remeda'
import { isEmpty } from 'remeda/dist/es'
import type { Database } from '~/types/supabase'

const waiting = ref(false)
const email = ref('')

const available = computed(() => {
	return !isEmpty(email.value) && !waiting.value
})

const supabase = useSupabaseClient<Database>()
const $message = useMessage()

const login = async () => {
	waiting.value = true

	const { error } = await supabase.auth.signInWithOtp({
		email: email.value,
		options: {
			emailRedirectTo: new URL('/toolbox/auth/confirm', location.href).toString()
		}
	})

	if (!isDefined(error)) {
		$message.success('一封包含访问链接的邮件已经发送你到邮箱!')
	}

	waiting.value = false
}
</script>

<template>
	<n-card class="w-fit mx-auto">
		<n-flex vertical>
			<n-input v-model:value="email" :disabled="waiting" placeholder="邮箱" type="text"/>
			<n-button :disabled="!available" :loading="waiting" class="w-full" @click="login">登录</n-button>
		</n-flex>
	</n-card>
</template>