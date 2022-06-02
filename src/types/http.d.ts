declare namespace http {
  type RequestOptions = Omit<
    UniApp.RequestOptions,
    "success" | "fail" | "complete"
  >;

  type ResponseResult<T> = Omit<UniApp.RequestSuccessCallbackResult, "data"> & {
    data: {
      code: string;
      msg?: string;
      message?: string;
      result: T;
    };
  };
}
