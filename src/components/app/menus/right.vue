<script lang="ts" setup>
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@vicons/antd'
import { type MenuOption } from 'naive-ui'
import { merge } from 'remeda'
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const logoutWaiting = ref(false)

const menus = computed<MenuOption[]>(() => {
	if (user.value !== null) {
		return [
			merge(createMenu(user.value.email ?? '未知', UserOutlined), {
				children: [
					merge(createMenu('登出', LogoutOutlined), {
						disabled: logoutWaiting.value,
						callback: async () => {
							logoutWaiting.value = true
							await supabase.auth.signOut()
							logoutWaiting.value = false
						}
					})
				]
			})
		]
	} else {
		return [
			createRouteMenu('登录', 'auth-login', LoginOutlined)
		]
	}
})

const handleUpdate = (_key: string, option: MenuOption) => {
	if ('callback' in option && typeof option.callback === 'function') {
		option.callback()
	}
}
</script>

<template>
	<div class="w-fit">
		<n-menu :options="menus" :value="$route.name" mode="horizontal" @update:value="handleUpdate"/>
	</div>
</template>