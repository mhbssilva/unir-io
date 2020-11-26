import AWS from 'aws-sdk';
import { Errors } from '../../commons/errors/aws-s3';
import awsConfig from '../../config/aws';

type AwsS3ServiceUploadImage = (
  base64Image: string,
  fileName: string
) => Promise<{ imageUrl: string; imageName: string }>;

class AwsS3Service {
  public uploadImage: AwsS3ServiceUploadImage = async (
    base64Image: string,
    fileName: string
  ) => {
    try {
      AWS.config.update({ region: awsConfig.s3.buckets.image.region });

      const s3 = new AWS.S3();
      const base64Data = Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );
      const imageExtension = base64Image.split(';')[0].split('/')[1];

      const params = {
        Bucket: awsConfig.s3.buckets.image.name,
        Key: `${fileName}.${imageExtension}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${imageExtension}`
      };

      const { Location, Key } = await s3.upload(params).promise();

      return {
        imageName: Key,
        imageUrl: Location
      };
    } catch (error) {
      throw Errors.UNABLE_TO_UPLOAD_IMAGE({ error });
    }
  };
}

export default AwsS3Service;
