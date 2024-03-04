<script lang="ts" setup>
import { HomeOutlined, UserOutlined } from '@vicons/antd'
import { type MenuOption } from 'naive-ui'
import { isDefined, merge } from 'remeda'

const user = useSupabaseUser()

const menus = computed<MenuOption[]>(() => {
	return [
		createRouteMenu('主页', 'index', HomeOutlined),
		merge(createMenuWithImageIcon('TETR.IO', 'https://txt.osk.sh/branding/tetrio-color.svg'), {
			children: [
				createRouteMenuWithClassIcon('段位', 'tetrio-ranks', 'i-ic:outline-leaderboard'),
				merge(createRouteMenu('您', 'tetrio-me', UserOutlined), {
					disabled: !isDefined(user.value)
				})
			]
		})
	]
})
</script>

<template>
	<div class="w-fit">
		<n-menu :options="menus" :value="$route.name" mode="horizontal"/>
	</div>
</template>