import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TransformResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    console.log(res.statusCode)
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(body);
        // Modify the response body only for successful responses
        const transformedBody = {
          success: true,
          message: 'Request processed successfully',
          data: body
        };
        return originalJson.call(this, transformedBody);
      }

      // For error responses, send the original body
      return originalJson.call(this, body);
    };

    next();
  }
}