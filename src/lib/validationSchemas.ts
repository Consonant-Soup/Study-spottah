import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

// Validation Schema for adding spots
const yesNoUnknownField = Yup.string()
  .oneOf(['yes', 'no', 'unknown'], 'Please select yes, no, or unknown')
  .required('This field is required');

export const AddSpotSchema = Yup.object({
  name: Yup.string().required('Spot name is required'),
  location: Yup.string().optional(),
  coverage: Yup.string()
    .oneOf(['INDOOR', 'OUTDOOR', 'OUTDOOR_COVERED'], 'Please select a coverage type')
    .required('Coverage is required'),
  outlets: yesNoUnknownField,
  foodAllowed: yesNoUnknownField,
  microwave: yesNoUnknownField,
  groupstudy: yesNoUnknownField,
  ac: yesNoUnknownField,
  printer: yesNoUnknownField,
  computers: yesNoUnknownField,
  whiteboard: yesNoUnknownField,
  projector: yesNoUnknownField,
  chalkboard: yesNoUnknownField,
  windows: yesNoUnknownField,
  tutors: yesNoUnknownField,
  freePaper: yesNoUnknownField,
  largeFormatPrinter: yesNoUnknownField,
  nearBathroom: yesNoUnknownField,
  nearWaterFountain: yesNoUnknownField,
  nearVendingMachine: yesNoUnknownField,
  nearFoodStore: yesNoUnknownField,
  nearBusStop: yesNoUnknownField,
  nearShuttle: yesNoUnknownField,
  noiselvl: Yup.number()
    .typeError('Noise level must be a number')
    .integer('Noise level must be a whole number')
    .min(1, 'Noise level must be between 1 and 5')
    .max(5, 'Noise level must be between 1 and 5')
    .required('Noise level is required'),
  imageUrl: Yup.string().url('Must be a valid URL').optional(),
  comments: Yup.string().optional(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddProfileSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  uhemail: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  username: Yup.string().required('Please pick a username'),
  major: Yup.string().required('Major is required'),
  standing: Yup.string()
    .oneOf(['freshman', 'sophmore', 'junior', 'senior', 'masters', 'phd'])
    .required('Standing is required'),
  profilepic: Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .url('Must be a valid URL')
    .optional(),
});
