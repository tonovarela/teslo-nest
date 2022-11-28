
import { v4 as uuid } from "uuid";

export const fileNamer =(req, file, callback) =>{
    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`;
    return callback(null,fileName);        
  }