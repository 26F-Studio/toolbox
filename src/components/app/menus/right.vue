<script lang="ts" setup>
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@vicons/antd'
import { type MenuOption } from 'naive-ui'
import { isDefined, merge } from 'remeda'

const user = useSupabaseUser()

const menus = computed<MenuOption[]>(() => {
	if (isDefined(user.value)) {
		return [
			merge(createMenu(user.value.email ?? '未知', UserOutlined), {
				children: [
					createMenu('登出', LogoutOutlined)
				]
			})
		]
	} else {
		return [
			createRouteMenu('登录', 'auth-login', LoginOutlined)
		]
	}
})
</script>

<template>
	<div class="w-fit">
		<n-menu :options="menus" :value="$route.name" mode="horizontal"/>
	</div>
</template>