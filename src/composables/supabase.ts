import { isDefined } from 'remeda'

export const getUser = async () => {
	const user = useSupabaseUser()

	if (!isDefined(user.value)) {
		throw createError({
			statusCode: 401,
			statusMessage: '请先登录'
		})
	}

	return user.value
}

export const invokeTetrioProfile = async (value: string) => {
	return await useSupabaseClient().functions
		.invoke<{
			readonly status: 200
			readonly data: {
				readonly id: string
				readonly name: string
			}
		} | {
			readonly status: 404
		} | {
			readonly status: 400
		}>('tetrio_profile', {
			method: 'POST',
			body: {
				name: value
			}
		})
		.then(response => {
			const result = response.data

			if (!isDefined(result)) {
				throw createError({
					statusCode: 500,
					statusMessage: '请求异常'
				})
			}

			if (result.status === 404) {
				throw createError({
					statusCode: 404,
					statusMessage: '用户不存在'
				})
			}

			if (result.status === 400) {
				throw createError({
					statusCode: 500,
					statusMessage: '调用异常, 请到控制台查看'
				})
			}

			return result.data
		})
}