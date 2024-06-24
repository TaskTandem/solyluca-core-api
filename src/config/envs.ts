import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    AWS_ACCESS_KEY_ID: string;
    AWS_S3_BUCKET_NAME: string;
    AWS_S3_REGION: string;
    AWS_SECRET_ACCESS_KEY: string;
    BACKUPS_DIRECTORY: string;
    DB_CONTAINER_NAME: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_USERNAME: string;
    JWT_SECRET: string;
    PORT: number;
    UPLOAD_RATE_LIMIT: number;
    UPLOAD_RATE_TTL: number;
    TEMP_IMAGES_DIRECTORY: string;
}

const envsSchema = joi.object({
    AWS_ACCESS_KEY_ID: joi.string().required(),
    AWS_S3_BUCKET_NAME: joi.string().required(),
    AWS_S3_REGION: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required(),
    BACKUPS_DIRECTORY: joi.string().required(),
    DB_CONTAINER_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().required(),
    UPLOAD_RATE_LIMIT: joi.number().required(),
    UPLOAD_RATE_TTL: joi.number().required(),
    TEMP_IMAGES_DIRECTORY: joi.string().required(),
})
.unknown( true );

const { error, value } = envsSchema.validate( process.env );

if ( error ) throw new Error(`Config validation error: ${ error.message }`);

const envVars: EnvVars = value;

export const envs = {
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsS3BucketName: envVars.AWS_S3_BUCKET_NAME,
    awsS3Region: envVars.AWS_S3_REGION,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    backupsDirectory: envVars.BACKUPS_DIRECTORY,
    dbContainerName: envVars.DB_CONTAINER_NAME,
    dbHost: envVars.DB_HOST,
    dbName: envVars.DB_NAME,
    dbPassword: envVars.DB_PASSWORD,
    dbPort: envVars.DB_PORT,
    dbUsername: envVars.DB_USERNAME,
    jwtSecret: envVars.JWT_SECRET,
    port: envVars.PORT,
    uploadRateLimit: envVars.UPLOAD_RATE_LIMIT,
    uploadRateTtl: envVars.UPLOAD_RATE_TTL,
    tempImagesDirectory: envVars.TEMP_IMAGES_DIRECTORY
}
