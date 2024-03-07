<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { isDefined } from 'remeda'

const $message = useMessage()
const params = new URLSearchParams(location.search)

if (params.has('error')) {
	navigateTo('/')

	throw createError({
		statusCode: 403,
		statusMessage: params.get('error_description') ?? '未知错误'
	})
}

const user = useSupabaseUser()

const timeout = setTimeout(() => {
	$message.error('登录超时')
	navigateTo('/')
}, 1000 * 10)

watch(user, () => {
	if (isDefined(user.value)) {
		clearTimeout(timeout)
		$message.success('登录成功!')
		navigateTo('/')
	}
}, {
	immediate: true
})
</script>

<template>
	<n-flex vertical>
		<div class="overflow-hidden">
			<n-result class="animate-spin" size="huge" status="404"/>
		</div>

		<div class="text-center">
			<n-text class="text-4xl fw-bold animate-(pulse duration-800)">登录中...</n-text>
		</div>
	</n-flex>
</template>