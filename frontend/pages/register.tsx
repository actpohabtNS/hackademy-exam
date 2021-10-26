import { useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'
import formStyles from '../styles/Forms.module.css' 
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'
import { signUp } from './api/auth'

const Register: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={ formStyles.dino_bg }>
      <Form title="Sign up">
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
          className="mb-8"
          onChange={e => setPassword(e.target.value)}
        />

        <Input
          placeholder="Confirm password"
          type="password"
          className="mb-16"
        />

        <div className="flex justify-end">
          <Button
            type="button"
            text="Back"
            className="bg-gray-400 hover:bg-gray-500 self-end mr-6"
            onClick={() => Router.push('login')}
          />

          <Button
            type="button"
            text="Sign up"
            className="bg-yellow-300 hover:bg-yellow-400 self-end"
            onClick={() => signUp(email, password)}
          />
        </div>

      </Form>
    </div>
  )
}

export default Register
