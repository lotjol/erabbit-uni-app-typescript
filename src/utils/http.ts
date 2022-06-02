type RequestOptions = Omit<
  UniApp.RequestOptions,
  "success" | "fail" | "complete"
>;

export default async function http(options: RequestOptions) {
  const { data } = await (function () {
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: resolve,
        fail: reject,
      });
    });
  })();

  return data;
}

// 记录请求队列
let queue: string[] = [];

// 添加拦截器
uni.addInterceptor("request", {
  invoke(options: RequestOptions) {
    // 处理接口路径
    if (!options.url.startsWith("http"))
      options.url =
        "https://pcapi-xiaotuxian-front-devtest.itheima.net" + options.url;

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
