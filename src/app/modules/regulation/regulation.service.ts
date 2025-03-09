import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IRegulation } from './regulation.interface';
import Regulation from './regulation.model';
import Notification from '../notification/notification.model';
import NormalUser from '../normalUser/normalUser.model';
import { getIO } from '../../socket/socket';

const createRegulation = async (profileId: string, payload: IRegulation) => {
  const io = getIO();
  const result = await Regulation.create(payload);
  const user = await NormalUser.findById(profileId);
  await Notification.create({
    title: user ? user.firstName + user.lastName : 'Admin',
    message: result.smokingRestriction
      ? `Added smoking regulation for ${result.country}`
      : `Added duty free allowance for ${result.country}`,
    receiver: 'all',
  });

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

const getSingleRegulation = async (country: string) => {
  const result = await Regulation.findOne({ country: country });
  if (result) {
    return result;
  }
  return null;
};

const RegulationService = {
  createRegulation,
  updateRegulation,
  getSingleRegulation,
};

export default RegulationService;
