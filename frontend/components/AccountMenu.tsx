import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { signOut } from '../pages/api/auth'
import Router from 'next/router'

type Props = {
  className?: string,
}

const AccountMenu = ({ className } : Props) => {
  return (
    <div className={`${className} z-10 flex flex-col px-6 py-2 pb-6 bg-white filter drop-shadow-xl`}>
      <div className="flex justify-between items-center mb-3">
        <div>
          <Image src="/img/logo.png" alt="openware logo" width={30} height={21} />
          <span className={`inline-block ml-2 text-2xl font-ns text-gray-600`}>
            Todo
          </span>
        </div>

        <span
          className="text-gray-400 text-md cursor-pointer hover:text-gray-600 hover:underline"
          onClick={() => {signOut(); Router.push('/login')}}
        >
          Sign out
        </span>
      </div>

      <div className="flex">
        <FontAwesomeIcon
          icon={faUserCircle}
          size="6x"
          className="flex-5 text-gray-400 mr-6"
        />

        <div className="flex-7 flex flex-col justify-start items-start">
          <span className="text-lg text-black">
            user@account.com
          </span>
          <span className="text-md text-yellow-350 cursor-pointer hover:text-yellow-400 hover:underline">
            My profile
          </span>
        </div>
      </div>
    </div>
  )
}

export default AccountMenu;
