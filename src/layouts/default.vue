<script lang="ts" setup>
import { HomeOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@vicons/antd'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { darkTheme, dateZhCN, lightTheme, type MenuOption, useOsTheme, zhCN } from 'naive-ui'
import { isFunction, isNonNullish, isNullish, merge } from 'remeda'
import type { Database } from '~/types/supabase'

const osTheme = useOsTheme()

const theme = computed(() => {
	if (osTheme.value === 'dark') {
		return darkTheme
	}

	return lightTheme
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const breakpoints = useBreakpoints(breakpointsTailwind)
const logoutWaiting = ref(false)

const menus = computed(() => {
	return [
		[
			createRouteMenu('主页', 'index', HomeOutlined),
			merge(createMenuWithImageIcon('TETR.IO', 'https://txt.osk.sh/branding/tetrio-color.svg'), {
				children: [
					createRouteMenuWithClassIcon('段位', 'tetrio-ranks', 'i-ic:outline-leaderboard'),
					merge(createRouteMenu('您', 'tetrio-me', UserOutlined), {
						disabled: isNullish(user.value)
					})
				]
			})
		],
		isNonNullish(user.value) ? [
			merge(createMenu(user.value?.email ?? '未知', UserOutlined), {
				children: [
					merge(createMenu('登出', LogoutOutlined), {
						disabled: logoutWaiting.value,
						callback: async () => {
							try {
								logoutWaiting.value = true
								await supabase.auth.signOut()
							} finally {
								logoutWaiting.value = false
							}
						}
					})
				]
			})
		] : [
			createRouteMenu('登录', 'auth-login', LoginOutlined)
		]
	]
})

const handleMenuUpdate = (_key: string, option: MenuOption) => {
	if ('callback' in option && isFunction(option.callback)) {
		option.callback()
	}
}
</script>

<template>
	<n-config-provider :date-locale="dateZhCN" :locale="zhCN" :theme="theme">
		<n-dialog-provider>
			<n-loading-bar-provider>
				<n-message-provider>
					<n-notification-provider>
						<n-layout position="absolute">
							<n-layout-header>
								<n-flex v-if="breakpoints.greater('sm').value" justify="space-between">
									<div v-for="items in menus" class="w-fit">
										<n-menu :options="items" :value="$route.name" mode="horizontal"
												@update:value="handleMenuUpdate"/>
									</div>
								</n-flex>

								<n-menu v-else :options="menus.flat()" :value="$route.name"
										mode="vertical" @update:value="handleMenuUpdate"/>
							</n-layout-header>

							<n-layout-content>
								<div class="px-2 py-10">
									<KeepAlive>
										<Suspense>
											<NuxtErrorBoundary>
												<slot/>

												<template #error="{ error, clearError }">
													<n-modal class="w-screen h-screen bg-black" show>
														<div class="<sm:(p-5) sm:(flex justify-center items-center)">
															<n-flex vertical>
																<n-result status="error"/>

																<n-text class="text-4xl fw-bold" @click="clearError">
																	{{ error.value.message }}
																</n-text>

																<n-button @click="clearError">我知道了</n-button>
															</n-flex>
														</div>
													</n-modal>
												</template>
											</NuxtErrorBoundary>

											<template #fallback>
												<div class="mx-auto text-center">
													<n-spin/>
												</div>
											</template>
										</Suspense>
									</KeepAlive>
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
</template>