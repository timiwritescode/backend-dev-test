import { createHash } from "crypto";


/**
 * Function generates hash for file buffers which is then used
 * to reference the stored file to avoid storing files with different name but
 * same buffers i.e duplicates more than once, to conserve storage resources
 * 
 * 
 * @param fileBuffer 
 * @returns an heaxadecimal hash of file
 */
export function generateFileHash(fileBuffer: Buffer): string {
      const hash = createHash("sha256");
      hash.update(fileBuffer);
      return hash.digest("hex");
    
  }