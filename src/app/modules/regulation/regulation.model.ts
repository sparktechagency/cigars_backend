import { model, Schema } from 'mongoose';
import { IRegulation } from './regulation.interface';

const regulationSchema = new Schema<IRegulation>({
  country: {
    type: String,
    required: true,
  },
  smokingRestriction: {
    type: String,
  },
  dutyFreeAllowance: {
    type: String,
  },
});

const Regulation = model('Regulation', regulationSchema);

export default Regulation;
