<script lang="ts" setup>
import { NuxtLink } from '#components'
import { HomeOutlined, UserOutlined } from '@vicons/antd'
import { darkTheme, dateZhCN, lightTheme, type MenuOption, NIcon, NImage, useOsTheme, zhCN } from 'naive-ui'

const osTheme = useOsTheme()

const theme = computed(() => {
	if (osTheme.value === 'dark') {
		return darkTheme
	}

	return lightTheme
})

const menus: MenuOption[] = [
	{
		label: () => h(NuxtLink, {
			to: {
				name: 'index'
			}
		}, () => '主页'),
		key: 'index',
		icon: () => h(NIcon, {
			component: HomeOutlined
		})
	},
	{
		label: 'TETR.IO',
		key: 'tetrio',
		icon: () => h(NImage, {
			imgProps: {
				class: 'w-8'
			},
			src: 'https://txt.osk.sh/branding/tetrio-color.svg'
		}),
		children: [
			{
				label: () => h(NuxtLink, {
					to: {
						name: 'tetrio-ranks'
					}
				}, () => '段位'),
				key: 'tetrio-ranks',
				icon: () => h('div', {
					class: 'w-8 h-8 i-ic:outline-leaderboard'
				})
			},
			{
				label: () => h(NuxtLink, {
					to: {
						name: 'tetrio-me'
					}
				}, () => '您'),
				key: 'tetrio-me',
				icon: () => h(NIcon, {
					component: UserOutlined
				})
			}
		]
	}
]
</script>

<template>
	<NuxtLayout>
		<NuxtLoadingIndicator/>

		<n-config-provider :date-locale="dateZhCN" :locale="zhCN" :theme="theme">
			<n-dialog-provider>
				<n-loading-bar-provider>
					<n-message-provider>
						<n-notification-provider>
							<n-layout position="absolute">
								<n-layout-header>
									<n-menu :options="menus" :value="$route.name" mode="horizontal"/>
								</n-layout-header>

								<n-layout-content>
									<div class="px-2 py-10">
										<Suspense>
											<NuxtPage/>

											<template #fallback>
												<div class="mx-auto text-center">
													<n-spin/>
												</div>
											</template>
										</Suspense>
									</div>
								</n-layout-content>

								<n-layout-footer class="p-2 text-center">
									<n-text>&copy; 2024 - {{ new Date().getFullYear() }}</n-text>
									<n-divider vertical/>
									<n-button href='https://studio26f.org' tag='a' text>26F Studio</n-button>
								</n-layout-footer>
							</n-layout>
						</n-notification-provider>
					</n-message-provider>
				</n-loading-bar-provider>
			</n-dialog-provider>
		</n-config-provider>
	</NuxtLayout>
</template>

<style>
:root, body {
	@apply m-0 p-0 w-full h-full font-sans text-[12px];
}

.page-enter-active,
.page-leave-active {
	@apply transition-(all duration-300) ease-in-out;
}

.page-enter-from,
.page-leave-to {
	@apply opacity-0 blur;
}
</style>