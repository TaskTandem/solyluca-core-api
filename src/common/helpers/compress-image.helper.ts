import * as webp from 'webp-converter';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { envs } from '../../config/envs';

interface ConvertBufferToWebpResponse {
    inputPath: string;
    outputPath: string;
    tempDir: string;
}

export async function convertBufferToWebp( inputBuffer: Buffer, extension: string ): Promise<ConvertBufferToWebpResponse> {
    const tempDir = path.join(envs.tempImagesDirectory, 'temp');
    await fs.promises.mkdir(tempDir, { recursive: true });

    const inputPath = path.join(tempDir, `input-${uuidv4()}-input.${extension}`);
    const outputPath = path.join(tempDir, `output-${uuidv4()}-output.webp`);

    await fs.promises.writeFile(inputPath, inputBuffer);
    
    return new Promise(( resolve, reject ) => {
        webp.cwebp(inputPath, outputPath, '-q 30')
        .then( () => {
            resolve( { inputPath, outputPath, tempDir } );
        })
        .catch( ( error: unknown )  => reject );
    });

}
