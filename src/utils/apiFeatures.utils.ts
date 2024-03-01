// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeGeocoder = require('node-geocoder');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
import { JwtService } from '@nestjs/jwt';
import { Location } from '../restaurants/schemas/location.schema';

export default class APIFeatures {
  static async getRestaurantLocation(address: string) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        // httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };
      const geocoder = NodeGeocoder(options);
      const loc = await geocoder.geocode(address);
      const location: Location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
      };
      return location;
    } catch (err) {
      console.log(err);
    }
  }
  static async uplaod(files: Array<Express.Multer.File>) {
    const images = [];
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: 'olympic_flag',
          folder: 'Restaurants',
        });
        images.push(result.secure_url);
        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }
  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }
}
