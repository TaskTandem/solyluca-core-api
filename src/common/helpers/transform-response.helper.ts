export const generateResponseObject = ( data: any, statusCode: number, message?: string) => {
    return {
        success: true,
        message: message || 'Request processed successfully',
        data,
        statusCode,
    };
}