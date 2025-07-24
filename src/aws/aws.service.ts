import { HeadObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvService } from 'src/config/env.service';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class AwsService {
    private client: S3Client;
    private bucketName: string;
    private s3Region: string;
    constructor(
        private envService: EnvService
    ) {
        this.bucketName = this.envService.awsS3BucketName;
        this.s3Region = this.envService.awsS3BucketRegion;

        this.client = new S3Client({
            region: this.s3Region,
            credentials: {
                accessKeyId: this.envService.awsAccessKeyId,
                secretAccessKey: this.envService.awsSecretAccessKey
            },
            forcePathStyle: true,
        });

        
    }


    async uploadSingleFile(file: Express.Multer.File, imageHash: string, isPublic = true):  Promise<string> {
            
            const key = `${imageHash}/${file.originalname}`;

            // check if image already exists 
            if (await this.isFolderExistsInS3Bucket(imageHash)) {
                return `https://${this.bucketName}.s3.amazonaws.com/${key}`
            }
            
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: isPublic ? 'public-read': 'private',

                Metadata: {
                    originalName: file.originalname,
                },
            }); 

            
            const uploadResult = await this.client.send(command);
            
           return `https://${this.bucketName}.s3.amazonaws.com/${key}`
        
    }


    async isFolderExistsInS3Bucket(folderName:string) {
       
        const command = new ListObjectsCommand({
                Bucket: this.bucketName,
                Prefix: folderName,
                MaxKeys: 2
            })
            
        const result = await this.client.send(command)
        if (result.Contents) {
                return true
            }
        return false
       }
}