import bcrypt from "bcrypt";
import { AppError, DatabaseError } from "../errors";
import { JoiUserSchema, JoiUserLoginSchema, JoiUpdateUserSchema } from "../user/user.model";
import type { signingUpUser, UserDocument, possibleUserUpdateValues, UserSchema } from "@rupture/types";

export function validFollowOrUnfollowRequest(
    type: "follow" | "unfollow",
    requestingUser: UserDocument,
    targetUser: UserDocument
): void {
    const isFollowed: boolean = targetUser?.followers.includes(String(requestingUser?._id)) as boolean;
    if (requestingUser!._id.equals(targetUser!._id)) {
        throw new Error("You cannot follow/unfollow yourself");
    }
    if (type === "follow") {
        if (isFollowed) {
            throw new AppError(`You are already following ${targetUser!.userName}`, 400);
        }
    } else {
        if (!isFollowed) {
            throw new AppError(`You are already unfollowing ${targetUser!.userName}`, 400);
        }
    }
}

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

export async function validateToUpdate(toUpdate: possibleUserUpdateValues): Promise<void> {
    // Deletes all nullish type values and tests it against JOI user schema
    Object.keys(toUpdate).forEach(item =>
        toUpdate[item as keyof possibleUserUpdateValues] == null
            ? delete toUpdate[item as keyof possibleUserUpdateValues]
            : ""
    );
    await JoiUpdateUserSchema.validateAsync(toUpdate);
}

export async function updateUserWithValidValues(
    requestingUser: UserDocument,
    toUpdate: possibleUserUpdateValues
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
    updateUserWithValidValues,
    validFollowOrUnfollowRequest
};

export default userValidators;
