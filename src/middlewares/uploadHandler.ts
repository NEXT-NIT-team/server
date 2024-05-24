import multer from 'multer'
import { BadRequestError } from '../core/Error';
import { UPLOAD_SIZE_LIMIT } from '../config';

const storage = multer.diskStorage({
  // Destination to store image     
  destination: 'public/static',
  filename: (req, file: any, cb) => {
    const uniqSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // set filename
    let fileName = uniqSuffix + "-" + file.originalname;
    // remove white spaces
    fileName = fileName.replace(/\s/g, "-");
    // return file
    cb(null, fileName);
  }
});

export default multer({
  storage,
  limits: {
    fileSize: Number(UPLOAD_SIZE_LIMIT), //20mb
  },
  // checks if the image is of suitable type
  fileFilter(req: any, file: any, err: Function) {
    // cb is callback function
    if (!file.originalname.match(/\.(webp|jpg|jpeg|png|ico|gif|heic|mpeg|doc|pdf|xls|xlsx|csv|ppt|pptx|docx|odt|txt|m4a|flac|mp3|mp4|wav|wma|aac|HEIF|HEVC|HEIC)$/)) {
      return err(
        new BadRequestError(req.t("uploadValidImage"))
      );
    }
    // this code accepts the uploaded file
    err(undefined, true);
  },
});
