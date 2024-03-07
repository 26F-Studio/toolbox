import { NuxtLink } from '#components'
import { type MenuOption, NIcon, NImage } from 'naive-ui'
import { merge, pick } from 'remeda'
import type { Component } from 'vue'

export const createMenu = (name: string, icon: Component): MenuOption => {
	return {
		label: name,
		key: name,
		icon: () => h(NIcon, {
			component: icon
		})
	}
}

export const createMenuWithClassIcon = (name: string, iconClass: string): MenuOption => {
	return merge(createMenu(name, {}), {
		icon: () => h('div', {
			class: `w-8 h-8 ${iconClass}`
		})
	})
}

export const createMenuWithImageIcon = (name: string, imageSrc: string): MenuOption => {
	return merge(createMenu(name, {}), {
		icon: () => h(NImage, {
			imgProps: {
				class: 'w-full h-full'
			},
			src: imageSrc
		})
	})
}

export const createRouteMenu = (name: string, routeName: string, icon: Component): MenuOption => {
	return merge(createMenu(name, icon), {
		label: () => h(NuxtLink, {
			to: {
				name: routeName
			}
		}, () => name),
		key: routeName
	})
}

export const createRouteMenuWithClassIcon = (name: string, routeName: string, iconClass: string): MenuOption => {
	return merge(
		createRouteMenu(name, routeName, {}),
		pick(createMenuWithClassIcon(name, iconClass), ['icon'])
	)
}

export const createRouteMenuWithImageIcon = (name: string, routeName: string, imageSrc: string): MenuOption => {
	return merge(
		createRouteMenu(name, routeName, {}),
		pick(createMenuWithImageIcon(name, imageSrc), ['icon'])
	)
}