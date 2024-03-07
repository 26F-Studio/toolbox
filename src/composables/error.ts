export const createApplicationError = (error: unknown) => {
	console.error(error)

	return createError({
		statusCode: 500,
		statusMessage: '发生了一个错误, 请到控制台查看'
	})
}