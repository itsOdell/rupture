import bcrypt from "bcrypt";
import { DatabaseError } from "../errors";
import { JoiUserSchema, JoiUserLoginSchema, JoiUpdateUserSchema } from "../user/user.model";
import type { signingUpUser, UserDocument, possibleUpdateValues, UserSchema } from "@rupture/types";

export async function validateSignUpCredentials(values: signingUpUser): Promise<UserSchema> {
    const { firstName, lastName, userName, email, password } = values;

    return await JoiUserSchema.validateAsync({
        firstName,
        lastName,
        userName,
        email,
        password
    });
}

export async function validateLoginCredentials(values: {
    email: string;
    password: string;
}): Promise<Pick<UserSchema, "email" | "password">> {
    const { email, password } = values;

    return await JoiUserLoginSchema.validateAsync({ email, password });
}

export async function passwordMatches(password: string, hashedPassword: string): Promise<void> {
    const passwordIsMatched = await bcrypt.compare(password, hashedPassword);

    if (!passwordIsMatched) {
        throw new DatabaseError("Incorrect password.", 401);
    }
}

export async function validateToUpdate(toUpdate: possibleUpdateValues): Promise<void> {
    Object.keys(toUpdate).forEach(item =>
        toUpdate[item as keyof possibleUpdateValues] == null ? delete toUpdate[item as keyof possibleUpdateValues] : ""
    );
    await JoiUpdateUserSchema.validateAsync(toUpdate);
}

export async function updateUserWithValidValues(
    requestingUser: UserDocument,
    toUpdate: possibleUpdateValues
): Promise<void> {
    await requestingUser?.updateOne(toUpdate, {
        new: true,
        runValidators: true
    });
}

const userValidators = {
    validateSignUpCredentials,
    validateLoginCredentials,
    passwordMatches,
    validateToUpdate,
    updateUserWithValidValues
};

export default userValidators;
