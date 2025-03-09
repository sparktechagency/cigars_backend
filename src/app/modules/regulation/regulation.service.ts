import { IRegulation } from './regulation.interface';
import Regulation from './regulation.model';

const createRegulation = async (payload: IRegulation) => {
  const result = await Regulation.create(payload);
  return result;
};

const RegulationService = {
  createRegulation,
};

export default RegulationService;
