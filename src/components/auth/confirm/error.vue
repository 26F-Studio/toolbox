<script lang="ts" setup>
defineProps<{
	readonly description: string
}>()

const translates = {
	'Email link is invalid or has expired': '邮箱链接已过期'
}
</script>

<template>
	<n-flex vertical>
		<n-result status="error"/>

		<div class="text-center">
			<n-text class="text-4xl fw-bold">{{ translates[description] ?? description }}</n-text>
		</div>
	</n-flex>
</template>