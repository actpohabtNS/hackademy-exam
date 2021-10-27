import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

type Props = {
  className?: string,
}

const AddTask = ({ className } : Props) => {
  return (
    <div className={`w-full py-4 border-b-2 border-gray-200 text-yellow-350 cursor-pointer hover:text-yellow-400 hover:bg-gray-50 ${className}`}>
      <FontAwesomeIcon
        icon={faPlus}
        size="lg"
        className="mr-8"
      />
      <span className="text-2xl">
        Add a task
      </span>
    </div>
  )
}

export default AddTask;
