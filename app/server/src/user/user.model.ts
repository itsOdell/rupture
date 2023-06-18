import Joi from "joi";
import { Schema, model } from "mongoose";
import { emailValidator, websiteValidator } from "@rupture/validator";
import type { UserSchema } from "@rupture/types";
import { seedDefaultPfpOrGetId } from "@rupture/scripts";

export const JoiUserSchema = Joi.object<UserSchema>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required().min(3),
    email: Joi.string().required().min(3).email(),
    password: Joi.string().required().min(6)
});

export const JoiUserLoginSchema = Joi.object<Pick<UserSchema, "email" | "password">>({
    email: Joi.string().required().min(3).email(),
    password: Joi.string().required().min(6)
});

export const JoiUpdateUserSchema = Joi.object<
    Omit<UserSchema, "password" | "posts" | "saved" | "followers" | "following">
>({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    userName: Joi.string().optional().min(3),
    email: Joi.string().optional().min(3).email(),
    profilePicture: Joi.string().optional(),
    website: Joi.string()
        .optional()
        .custom((value, helpers) => {
            if (websiteValidator(value)) {
                return value;
            } else {
                return helpers.error("any.invalid", {
                    message: "Invalid website format"
                });
            }
        }),
    bio: Joi.string().optional(),
    phoneNumber: Joi.string().optional().min(6)
});

const userSchema = new Schema<UserSchema>(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            unique: true,
            required: true,
            minlength: 3
        },
        email: {
            type: String,
            required: true,
            minlength: [3, "Email is too short, please enter a valid email address."],
            unique: true,
            validate: [emailValidator, "Please enter a valid email address."]
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: Schema.Types.ObjectId,
            ref: "Media",
            required: false
        },
        postCount: Number,
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Posts"
            }
        ],
        saved: [
            {
                type: Schema.Types.ObjectId,
                ref: "Posts"
            }
        ],
        followerCount: Number,
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
        followingCount: Number,
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
        website: {
            type: String,
            required: false,
            validate: [websiteValidator, "Please enter a valid website URL"]
        },
        bio: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false,
            minlength: [6, "Phone number must atleast have 6 digits."]
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre<UserSchema>("save", async function (next) {
    if (this.profilePicture === undefined) {
        try {
            this.profilePicture = String(await seedDefaultPfpOrGetId());
            next();
        } catch (err) {
            next(err as Error);
        }
    } else {
        next();
    }
});

userSchema.pre<UserSchema>("validate", async function (next) {
    this.postCount = this.posts.length;
    this.followerCount = this.followers.length;
    this.followingCount = this.following.length;
});

const User = model("Users", userSchema);

export default User;
