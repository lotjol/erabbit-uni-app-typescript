export default async function http<T>(options: http.RequestOptions) {
  const { data } = await new Promise<http.ResponseResult<T>>(
    (resolve, reject) => {
      uni.request({
        ...options,
        success: (result: any) => {
          resolve(result);
        },
        fail: reject,
      });
    }
  );

  return data.result;
}

// 记录请求队列
let queue: string[] = [];

// 添加拦截器
uni.addInterceptor("request", {
  invoke(options: http.RequestOptions) {
    // 处理接口路径
    if (!options.url.startsWith("http"))
      options.url =
        "https://pcapi-xiaotuxian-front-devtest.itheima.net" + options.url;

    // 添加头信息
    options.header = {
      "source-client": "miniapp",
      ...options.header,
    };

    // 开启加载提示
    !queue.length &&
      uni.showLoading({
        title: "正在加载...",
        mask: true,
      });

    // 记录当前 loading 状态
    queue.push("loading");
  },

  complete() {
    // 更新 loading 状态
    queue.pop();

    // 关闭加载提示
    !queue.length && uni.hideLoading();
  },
});
