import formStyles from '../styles/Forms.module.css' 
import FormHeader from './FormHeader'

const Form: React.FC<any> = ({ title, className, children }) => {
  return (
    <div className={`p-12 ${formStyles.form} filter drop-shadow-xl ${className}`}>
      <FormHeader title={title} />
      { children }
    </div>
  )
}

export default Form