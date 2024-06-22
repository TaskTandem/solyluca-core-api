import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

// type ValidFields = 'id'|'email'|'password'|'fullName'|'isActive'|'roles';

export const GetRawHeaders = createParamDecorator(
    (data, ctx:ExecutionContext)=>{

        const req = ctx.switchToHttp().getRequest();

        return req.rawHeaders;

    }
);