import {Schema, model, Document} from 'mongoose'
import ISpeciality from './Speciality'



export default interface IDoctor extends Document {
  speciality: ISpeciality
  name: string,
  description: string
}


const schema = new Schema<IDoctor>({
  speciality: {
    
  }
})