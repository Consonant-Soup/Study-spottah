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

const validMajors = ['Engineering', 'Bio', 'Math'] as const;

export const AddSpotSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  outdoors: yesNoUnknownField,
  ac: yesNoUnknownField,
  microwave: yesNoUnknownField,
  outlets: yesNoUnknownField,
  windows: yesNoUnknownField,
  groupstudy: yesNoUnknownField,
  tutors: yesNoUnknownField,
  printer: yesNoUnknownField,
  noiselvl: Yup.number()
    .typeError('Noise level must be a number')
    .integer('Noise level must be a whole number')
    .min(1, 'Noise level must be between 1 and 7')
    .max(7, 'Noise level must be between 1 and 7')
    .required('Noise level is required'),
  foodAllowed: yesNoUnknownField,
  majors: Yup.array()
    .of(Yup.string().oneOf(validMajors).required())
    .min(1, 'Select at least one major')
    .required('Majors is required'),
  seating: yesNoUnknownField,
  computers: yesNoUnknownField,
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
