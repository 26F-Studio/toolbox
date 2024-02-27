<script lang="ts" setup>
import { isDefined } from 'remeda'

const user = useSupabaseUser()

watch(user, () => {
	if (isDefined(user.value)) {
		return navigateTo('/')
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