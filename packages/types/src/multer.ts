export type MulterFile = Express.Multer.File;
export type MulterDestinationCb = (error: Error | null, destination: string) => void;
export type MulterFilenameCb = (error: Error | null, filename: string) => void;
