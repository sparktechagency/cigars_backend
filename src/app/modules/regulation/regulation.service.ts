import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IRegulation } from './regulation.interface';
import Regulation from './regulation.model';

const createRegulation = async (payload: IRegulation) => {
  const result = await Regulation.create(payload);
  return result;
};

const updateRegulation = async (id: string, payload: Partial<IRegulation>) => {
  const regulation = await Regulation.findById(id);
  if (!regulation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Regulation not found');
  }

  const result = await Regulation.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const RegulationService = {
  createRegulation,
  updateRegulation,
};

export default RegulationService;
