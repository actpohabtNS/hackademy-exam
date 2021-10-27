import type { NextPage } from 'next'
import Router from 'next/router'
import formStyles from '../styles/Forms.module.css' 
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/Button'

const ForgotPassword: NextPage = () => {
  return (
    <div className={ formStyles.dino_bg }>
      <Form title="Forgot password">
        <Input
          placeholder="Email"
          type="email"
          className="mb-8"
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
            text="Sign in"
            className="bg-yellow-350 hover:bg-yellow-400 self-end"
          />
        </div>

      </Form>
    </div>
  )
}

export default ForgotPassword
