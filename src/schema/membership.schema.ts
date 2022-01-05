import { object, string, date, number, ref } from "yup";

export const registerMemberSchema = object({
  body: object({
    firstName: string().required("First name is required"),
    lastName: string().required("Last name is required"),
    middleName: string().required("Middle name is required"),
    suffix: string(),
    gender: string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
    birthDate: date().required("Birth date is required"),
    contactNumber: string()
      .required("Contact Number is required")
      .min(11, "Contact number is too short - should be 11 numbers"),
    companyId: string().required("Company Id is required"),
    department: string().required("Department is required"),
    position: string().required("Position is required"),
    dateHired: date().required("Date hired is required"),
    deduction: number()
      .moreThan(249, "Minimum of 250.00 pesos")
      .required("Amount is required"),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    confirmPassword: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
  }),
});
