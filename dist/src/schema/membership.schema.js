"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMemberSchema = void 0;
var yup_1 = require("yup");
exports.registerMemberSchema = yup_1.object({
    body: yup_1.object({
        firstName: yup_1.string().required("First name is required"),
        lastName: yup_1.string().required("Last name is required"),
        middleName: yup_1.string().required("Middle name is required"),
        suffix: yup_1.string(),
        gender: yup_1.string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
        birthDate: yup_1.date().required("Birth date is required"),
        contactNumber: yup_1.string()
            .required("Contact Number is required")
            .min(11, "Contact number is too short - should be 11 numbers"),
        companyId: yup_1.string().required("Company Id is required"),
        department: yup_1.string().required("Department is required"),
        position: yup_1.string().required("Position is required"),
        dateHired: yup_1.date().required("Date hired is required"),
        deduction: yup_1.number()
            .moreThan(249, "Minimum of 250.00 pesos")
            .required("Amount is required"),
        email: yup_1.string()
            .email("Must be a valid email")
            .required("Email is required"),
        password: yup_1.string()
            .required("Password is required")
            .min(6, "Password is too short - should be 6 chars minimum.")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
        confirmPassword: yup_1.string().oneOf([yup_1.ref("password"), null], "Passwords must match"),
    }),
});
