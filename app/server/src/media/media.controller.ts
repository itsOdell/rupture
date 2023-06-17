import path from "path";
import { getMediaById } from "./media.service";
import { ASSETS_DIR } from "@rupture/constants";
import { asyncHandler } from "@rupture/utils/src/asyncHandler";
import type { Response } from "express";

export const getMedia = asyncHandler(async function (req, res): Promise<Response | void> {
    const media = await getMediaById(req.params.assetId);

    return res.status(200).sendFile(path.join(ASSETS_DIR, media!.path));
});
