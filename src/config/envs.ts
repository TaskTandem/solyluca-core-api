import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    BACKUPS_DIRECTORY: string;
    DB_CONTAINER_NAME: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_USERNAME: string;
    JWT_SECRET: string;
    PORT: number;
}

const envsSchema = joi.object({
    BACKUPS_DIRECTORY: joi.string().required(),
    DB_CONTAINER_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().required(),
})
.unknown( true );

const { error, value } = envsSchema.validate( process.env );

if ( error ) throw new Error(`Config validation error: ${ error.message }`);

const envVars: EnvVars = value;

export const envs = {
    backupsDirectory: envVars.BACKUPS_DIRECTORY,
    dbContainerName: envVars.DB_CONTAINER_NAME,
    dbHost: envVars.DB_HOST,
    dbName: envVars.DB_NAME,
    dbPassword: envVars.DB_PASSWORD,
    dbPort: envVars.DB_PORT,
    dbUsername: envVars.DB_USERNAME,
    jwtSecret: envVars.JWT_SECRET,
    port: envVars.PORT,
}
