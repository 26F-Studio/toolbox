Deno.serve(async (request: Request) => {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
	}

	const response = (data: object) => {
		return new Response(
			JSON.stringify(data),
			{
				headers: {
					...corsHeaders,
					'content-type': 'application/json'
				},
				status: 200
			}
		)
	}

	if (request.method === 'OPTIONS') {
		return response({
			status: 200
		})
	}

	const data = await request.json()

	if ('name' in data) {
		const name = data.name.toLowerCase()

		const user = await fetch(`https://ch.tetr.io/api/users/${name}`)
			.then(async response => {
				return await response.json() as {
					readonly data?: {
						readonly user: {
							readonly _id: string
							readonly username: string
						}
					}
				}
			})
			.then(data => {
				return data.data?.user
			})

		if (user !== undefined) {
			return response({
				status: 200,
				data: {
					id: user._id,
					name: user.username
				}
			})
		}

		return response({
			status: 404
		})
	}

	return response({
		status: 400
	})
})