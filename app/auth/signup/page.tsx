'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.scss'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { checkUserExists } from '@/services'
import { getRandomPhotoId } from '@/utils/constants/profilePicIds'

export default function SignUpPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [signingIn, setSigningIn] = useState(false)

  // should redirect if not sigining in and also session is not there
  const shouldRedirect = !signingIn && session
  const router = useRouter()

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/')
    }
  }, [router, shouldRedirect])

  const {
    headingsContainer,
    mainContainer,
    loginBtnContainer,
    login,
    loadingState,
  } = styles

  const name = useRef('')
  const email = useRef('')
  const password = useRef('')
  const callbackUrl = useSearchParams().get('callbackUrl')

  if (shouldRedirect)
    return <div className={loadingState}>Redirecting to home page...</div>
  if (sessionStatus === 'loading')
    return <div className={loadingState}>Loading ...</div>

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSigningIn(true)

    const credentials = {
      name: name.current,
      email: email.current,
      password: password.current,
      photoId: getRandomPhotoId(),
    }
    // check for existing email
    const createId = toast.loading('Checking Email...')
    const checkUser = await checkUserExists(email.current)
    if (checkUser && checkUser.id) {
      toast.update(createId, {
        render: 'Email already exists!',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })
    }
    // create new account
    else {
      toast.update(createId, {
        render: 'Creating your account...',
        isLoading: true,
        autoClose: 3000,
      })
      const res = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
          // authorization: `Bearer ${process.env.HYGRAPH_PERMANENTAUTH_TOKEN}`,
        },
      })
      const user = await res.json()
      if (res.ok && user) {
        toast.update(createId, {
          render: '🎀 Account Created!',
          type: 'default',
          isLoading: false,
          autoClose: 3000,
        })
        // login to new account created
        const loginId = toast.loading('Logging you in, please wait...')
        await signIn('credentials', {
          email: email.current,
          password: password.current,
          redirect: false,
        })
        toast.update(loginId, {
          render: '🦄 Logged In!',
          type: 'default',
          isLoading: false,
          autoClose: 3000,
        })
        router.push(callbackUrl ?? '/')
      }
      // handle any errors
      else {
        setSigningIn(false)
        toast.update(createId, {
          render: res.statusText,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        })
      }
    }
  }
  return (
    <>
      <div className={mainContainer}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={headingsContainer}>
            <h3>Sign Up</h3>
          </div>
          {/* Name */}
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            minLength={3}
            maxLength={15}
            onChange={(e) => {
              name.current = e.target.value
            }}
            required
          />

          <br />
          <br />
          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            maxLength={35}
            onChange={(e) => {
              email.current = e.target.value
            }}
            required
          />

          <br />
          <br />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            name="pswrd"
            minLength={8}
            maxLength={20}
            onChange={(e) => {
              password.current = e.target.value
            }}
            required
          />
          <br />
          <br />
          <div className={loginBtnContainer}>
            <button type="submit" disabled={signingIn}>
              Create Account
            </button>
          </div>
          <p className={login}>
            Already have an account?{' '}
            <Link href={`/auth/signin?callbackUrl=${callbackUrl}`}>Login</Link>
          </p>
        </form>
      </div>
    </>
  )
}
