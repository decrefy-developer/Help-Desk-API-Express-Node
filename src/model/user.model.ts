import mongoose, {
  AggregatePaginateModel,
  HookNextFunction,
  Document,
} from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { DepartmentDocument } from "./department.model";
import { UnitDocument } from "./unit.model";

export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  departmentId: DepartmentDocument['_id'];
  unitId: UnitDocument["_id"];
  email: string;
  password: string;
  isActive: boolean;
  priviledge: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    email: { type: String, required: true, unique: true },
    password: { type: String, reqruied: true },
    isActive: { type: Boolean, default: true },
    priviledge: { type: Array, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: HookNextFunction) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

//used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

UserSchema.plugin(mongooseAggregatePaginate);

interface UserModel<T extends Document> extends AggregatePaginateModel<T> { }

const User: UserModel<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema
) as UserModel<UserDocument>;

export default User;
