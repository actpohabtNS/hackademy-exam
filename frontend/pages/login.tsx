import { useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import formStyles from '../styles/Forms.module.css' 
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'
import { signIn } from './api/auth'

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={ formStyles.dino_bg }>
      <Form title="Sign in">
        <Input
          value={email}
          placeholder="Email"
          type="email"
          className="mb-8"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          value={password}
          placeholder="Password"
          type="password"
          className="mb-6"
          onChange={e => setPassword(e.target.value)}
        />

        <div className="mb-2 font-roboto text-lg">
          <span>No account?</span>&nbsp;
          <Link href="/register">
            <a className="text-yellow-350 hover:text-yellow-400 hover:underline">Create one!</a>
          </Link>

          <br />

          <Link href="/forgot-password">
            <a className="text-gray-400 hover:text-black hover:underline">Forgot password?</a>
          </Link>
        </div>


        <div className="flex justify-end">
          <Button
            type="button"
            text="Sign in"
            className="bg-yellow-350 self-end hover:bg-yellow-400"
            onClick={() => signIn(email, password)}
          />
        </div>

      </Form>
    </div>
  )
}

export default Login
