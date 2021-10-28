import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import AccountMenu from './AccountMenu';

const Navbar = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className="w-full py-3 px-4 flex justify-between align-center border-b text-gray-700">
      <div className="w-1/4 border bg-gray-100 py-1 px-4">
        <FontAwesomeIcon
          icon={faSearch}
          className="mr-2 text-gray-700 text-xl"
        />
        <input
          className= "bg-transparent focus:outline-none focus:text-black placeholder-gray-500 text-xl"
          placeholder="Search"
        />
      </div>

      <div
        className="focus:outline-none"
        tabIndex={1000}
        onFocus={() => setMenuOpened(true)}
        onBlur={() => setMenuOpened(false)}
      >
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-gray-400 cursor-pointer hover:text-gray-500 text-4xl focus:outline-none"
        />

        {
          menuOpened &&
          <AccountMenu
            className="absolute right-4 top-14"
          />
        }
      </div>

    </div>
  )
}

export default Navbar
