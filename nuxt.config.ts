import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	srcDir: 'src',
	app: {
		head: {
			title: '方块工具箱'
		},
		pageTransition: {
			name: 'page',
			mode: 'out-in'
		}
	},
	devtools: {
		enabled: true
	},
	modules: [
		'@unocss/nuxt',
		'@nuxtjs/supabase'
	],
	vite: {
		plugins: [
			AutoImport({
				imports: [
					'vue',
					'vue-router',
					{
						'naive-ui': [
							'useDialog',
							'useMessage',
							'useNotification',
							'useLoadingBar'
						]
					}
				]
			}),
			Components({
				resolvers: [
					NaiveUiResolver()
				]
			})
		]
	},
	supabase: {
		url: 'https://eirvihbwvudtrvgnoitk.supabase.co',
		key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZpaGJ3dnVkdHJ2Z25vaXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MzE0NTIsImV4cCI6MjAyNDAwNzQ1Mn0.jXMvgsPbSJYp2RU7h6e8tm0Pf-_n17TBvJl2A0HeCFo',
		redirectOptions: {
			login: '/auth/login',
			callback: '/auth/confirm'
		}
	}
})