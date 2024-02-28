<script lang="ts" setup>
const user = useSupabaseUser()

watch(user, () => {
	if (user.value !== null) {
		return navigateTo('/')
	}
}, {
	immediate: true
})

const params = new URLSearchParams(location.search)
</script>

<template>
	<template v-if="!params.has('error')">
		<auth-confirm-waiting/>
	</template>

	<template v-else>
		<auth-confirm-error :description="params.get('error_description')"/>
	</template>
</template>