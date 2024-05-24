import fs from "fs"
import { Types } from 'mongoose';
import User from '../model/User';
import Attachment, { AttachmentAs, AttachmentModel } from '../model/Attachment';


var _ = require('lodash');
const sharp = require("sharp");
sharp.cache(false)



export default class AttachmentRepo {


  /**
  * Upload attachment
  * @param Attachment (Attachment)
  * @returns Attachment Object
  * */


  public static async upload(
    attachments: Attachment[],
    user: User,
    as: AttachmentAs): Promise<Attachment[]> {

    let ids: Attachment[] | any = []

    for (let i = 0; i < attachments.length; i++) {

      // initialize
      let attachment = attachments[i] as Attachment;
      attachment.createdAt = new Date();
      attachment.user = user;
      attachment.as = as;

      const isAvatar = attachment.originalname?.includes("isAvatar");

      if (attachment.as == AttachmentAs.AVATAR) {
        // @resize
        const buffer = await sharp(attachment.path)
          .resize(
            (attachment.as == AttachmentAs.AVATAR || isAvatar)
              ? { width: 100, height: 100, fit: sharp.fit.contain }
              : { fit: sharp.fit.contain })
          .flatten({ background: '#fff' })
          .png({ quality: 70 })
          .toBuffer();
        // set file
        await sharp(buffer).toFile(attachment.path);
      }

      // create
      const a = await AttachmentModel.create(attachment);
      ids.push(a.toObject()._id);
    }

    return ids;
  }


  /**
  * remove attachment by id
  * @param id (Attachment id)
  * @returns Attachment | null
  * */



  public static async remove(attachment: Types.ObjectId): Promise<Boolean> {
    const attachement = await AttachmentModel.findById(attachment).lean<Attachment>().exec();
    if (!attachement) return false;
    try {
      fs.unlinkSync(attachement.path);
    } catch (error) { }
    await AttachmentModel.findByIdAndDelete(attachement._id);
    return true;
  }


  /**
  * get stats
  * @returns Attachment
  * */



  public static async stats(): Promise<any[]> {
    const attachments = await AttachmentRepo.find();

    var groupedByMimeType = _.mapValues(_.groupBy(attachments, 'mimetype'),
      (clits: any) => clits.map((attachments: any) => _.omit(attachments, 'mimetype')));

    let fileTypeSize: any[] = [];
    let mimetypes = Object.keys(groupedByMimeType)

    mimetypes.forEach(mimetype => {
      const arr: any[] = groupedByMimeType[mimetype];

      const totalSize = arr.reduce<number>((acc, obj) => {
        if (!obj.size) obj.size = 0;
        return acc + obj.size;
      }, 0);

      fileTypeSize.push({ type: mimetype, totalSize, total: arr.length });
    });

    return fileTypeSize;
  }



  /**
  * Find attachment
  * @param _id (Attachment)
  * @returns Attachment Object
  * */



  public static findById(_id: Types.ObjectId): Promise<Attachment | null> {
    return AttachmentModel.findById(_id).lean<Attachment>().exec();
  }



  /**
  * Find all attachment without buffer
  * @returns Attachment[]
  * */



  public static find(): Promise<Attachment[]> {
    return AttachmentModel.find()
      //.select('-buffer')
      .lean<Attachment[]>()
      .exec();
  }
}
