class BaseResponse {
  static success: any = (body: any) => {
    return {
      statusCode: 200,
      body: JSON.stringify(body)
    };
  };

  static error: any = (error: Error) => {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: error.message
        }
      })
    };
  };
}

export { BaseResponse };
