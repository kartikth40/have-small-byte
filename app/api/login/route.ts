import { checkLogin } from '@/services'
import { signJwtAccessToken } from '@/services/jwt'
import * as bcrypt from 'bcrypt'

interface requestBody {
  email: string
  password: string
}

export async function POST(request: Request) {
  const body: requestBody = await request.json()

  const user = await checkLogin(body.email)

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user
    const accessToken = signJwtAccessToken(userWithoutPass)
    const result = {
      ...userWithoutPass,
      accessToken,
    }
    return new Response(JSON.stringify(result))
  } else {
    const myOptions = {
      status: 400,
      statusText: 'Incorrect Email or Password!',
    }
    return new Response(JSON.stringify(null), myOptions)
  }
}
