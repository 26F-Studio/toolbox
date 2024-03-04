<script lang="ts" setup>
import { darkTheme, dateZhCN, lightTheme, useOsTheme, zhCN } from 'naive-ui'

const osTheme = useOsTheme()

const theme = computed(() => {
	if (osTheme.value === 'dark') {
		return darkTheme
	}

	return lightTheme
})
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
									<n-flex justify="space-between">
										<app-menus-left/>
										<app-menus-right/>
									</n-flex>
								</n-layout-header>

								<n-layout-content>
									<NuxtErrorBoundary>
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

										<template #error="{ error }">
											<n-flex class="py-10" vertical>
												<n-result status="error"/>

												<div class="text-center">
													<n-text class="text-4xl fw-bold">
														{{ error.value.message }}
													</n-text>
												</div>
											</n-flex>
										</template>
									</NuxtErrorBoundary>
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