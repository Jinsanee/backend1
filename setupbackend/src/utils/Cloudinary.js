import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.COUDINARY_API_KEY,
        api_secret: process.env.COUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });

     
    const uploader = async (localfilepath) => {
        try {
            if (!localfilepath) return null;
             const responce = await cloudinary.uploader.upload(localfilepath, { // await is missing in this function
                resource_type: "auto"
            })
            console.log("file has been uploaded")
            return responce;
        } catch (error) {
            fs.unlinkSync(localfilepath)
            console.log("error in cloundinary") // remove the local file that not uploaded on server
            return null;
        }
    }

    export {uploader}
   
  





      // Upload process
    // const uploader = function  async (localfilepath) => {
    //     try {
    //         if (!localfilepath) return null;
    //          const responce = await cloudinary.uploader.upload(localfilepath, { // await is missing in this function
    //             resource_type: "auto"
    //         })
    //         console.log("file has been uploaded")
    //         return responce;
    //     } catch (error) {
    //         fs.unlinkSync(localfilepath) // remove the local file that not uploaded on server
    //         return null;
    //     }
    // }