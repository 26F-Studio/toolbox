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
	<n-result class="animate-spin" size="huge" status="404"/>
</template>