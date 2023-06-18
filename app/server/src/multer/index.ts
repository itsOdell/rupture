import multer from "multer";
import { resolve } from "path";
import { ASSETS_DIR } from "@rupture/constants";
import type { Request } from "express";
import type { MulterFile, MulterDestinationCb, MulterFilenameCb } from "@rupture/types";

const storage = multer.diskStorage({
    destination: function (req: Request, file: MulterFile, cb: MulterDestinationCb) {
        cb(null, resolve(ASSETS_DIR));
    },
    filename: function (req: Request, file: MulterFile, cb: MulterFilenameCb) {
        const invalidCharsRegex = /[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]/g;
        const cleanedFilename = file.originalname.replace(invalidCharsRegex, "");
        cb(null, `${Date.now()}_${cleanedFilename}`);
    }
});

const upload = multer({ storage });

export default upload;
