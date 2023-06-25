import userServices from "./user.service";
import { asyncHandler } from "@rupture/utils";
import type { NormalReqRes, RequestWithToken } from "@rupture/types";

export const getUser = asyncHandler(async function (req, res) {
    const user = await userServices.getOneUser(req.params.userName);

    return res.status(200).json(user);
});

export const createUser = asyncHandler(async function (req, res) {
    const createdUser = await userServices.createOneUser(req.body);

    return res.status(200).json({
        message: "User created successfully",
        id: createdUser!._id,
        userName: createdUser!.userName
    });
});

export const loginUser = asyncHandler(async function (req, res) {
    const userToken = await userServices.loginOneUser(req.body);

    return res.status(200).json({
        message: "Logged in successfully",
        token: userToken
    });
});

export const followUser = asyncHandler(async function (req: RequestWithToken, res) {
    await userServices.followOneUser(req);

    return res.status(200).json({
        message: `Successfully followed ${req.params.userName}`
    });
} as NormalReqRes);

export const unFollowUser = asyncHandler(async function (req: RequestWithToken, res) {
    await userServices.unFollowOneUser(req);

    return res.status(200).json({
        message: `Successfully unfollowed ${req.params.userName}`
    });
} as NormalReqRes);

export const patchUser = asyncHandler(async function (req: RequestWithToken, res) {
    await userServices.patchOneUser(req);

    return res.status(200).json({
        message: "Successfully updated account"
    });
} as NormalReqRes);

export const getFollowers = asyncHandler(async function (req, res) {
    const followers = await userServices.getUserFollowers(req);

    return res.status(200).json(followers);
});

export const getFollowing = asyncHandler(async function (req, res) {
    const following = await userServices.getUserFollowing(req);

    return res.status(200).json(following);
});

export const deleteUser = asyncHandler(async function (req: RequestWithToken, res) {
    await userServices.deleteOneUser(req.requestingUser);
    return res.status(200).json({
        message: "succesfully deleted user"
    });
} as NormalReqRes);

const userController = {
    getUser,
    createUser,
    loginUser,
    followUser,
    unFollowUser,
    patchUser,
    getFollowers,
    getFollowing,
    deleteUser
};

export default userController;
