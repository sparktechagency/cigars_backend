import { model, Schema } from 'mongoose';
import { IRegulation } from './regulation.interface';

const regulationSchema = new Schema<IRegulation>({
  smokingRestriction: {
    type: String,
    default: 'Restriction not added yet',
  },
  dutyFreeAllowance: {
    type: String,
    default: 'Duty free allowance not added yet',
  },
});

const Regulation = model('Regulation', regulationSchema);

export default Regulation;
