import Image from 'next/image'

type Props = {
  title: string,
}

const FormHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className="mb-7">
      <Image src="/img/logo.png" alt="openware logo" width={40} height={28} />
      <span className={`inline-block ml-2 text-3xl font-ns text-gray-500 mb-2`}>Todo</span>
      <br />
      <span className={`text-2xl font-roboto font-medium`}>{ title }</span>
    </div> 
  )
}

export default FormHeader
