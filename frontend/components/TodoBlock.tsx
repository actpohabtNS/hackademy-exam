import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { MouseEventHandler } from 'react'
import { RotateProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  className?: string,
  textStyle?: string,
  iconStyle?: string,
  iconRotation?: RotateProp,
  text: string,
  fadedText?: string,
  icon: IconDefinition
  onBlockClick?: MouseEventHandler<HTMLDivElement>,
  onIconClick?: MouseEventHandler<SVGSVGElement>,
}

const TodoBlock = ({ className, textStyle, iconStyle, iconRotation, text, fadedText, icon, onBlockClick: onBlockClick, onIconClick } : Props) => {
  return (
    <div
      className={`${className} w-full py-4 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-50`}
      onClick={onBlockClick}
    >
      <FontAwesomeIcon
        icon={icon}
        size="lg"
        onClick={onIconClick}
        rotation={iconRotation}
        className={`${iconStyle} mr-8 ${iconStyle?.includes("text-") ? "" : "text-yellow-350 hover:text-gray-400"} filter hover:drop-shadow-lg`}
      />
      <span className={`${textStyle} text-2xl`}>
        {text}
      </span>

      {
        fadedText &&
        <span className="inline-block ml-3 text-gray-200 text-2xl">
          {fadedText}
        </span>
      }

    </div>
  )
}

export default TodoBlock;
