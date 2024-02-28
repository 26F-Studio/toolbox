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

const params = new URLSearchParams(location.search)
</script>

<template>
	<transition mode="out-in" name="page">
		<auth-confirm-waiting v-if="!params.has('error')"/>
		<auth-confirm-error v-else :description="params.get('error_description')"/>
	</transition>
</template>