/**
 * Knocket (https://knocket.trtc.io) 在线聊天组件配置
 *
 * 接入步骤：
 * 1. 在 https://knocket.trtc.io/zh/register/ 注册，创建「网页小组件」
 * 2. 从控制台「安装」页复制 identifier（形如 xxxxxxxx-xxxx-...）
 * 3. 填入下方 identifier，并把 enable 改为 true
 * 4. 在需要展示的页面引入 <ChatLoader />（见 src/components/knocket/ChatLoader.astro）
 *
 * 性能约定（务必遵守）：
 * - SDK 未压缩约 3.2 MB（gzip ≈ 887 KB），默认 mode 为 click，点击后才注入。
 * - 不要改成 immediate，也不要挂到 BaseLayout。
 * - enable 为 false 时不输出任何 DOM / 脚本 / 请求。
 */
export const knocket = {
  /** 总开关。关闭时全站零成本 */
  enable: true,

  /** 控制台「安装」页复制的组件标识符 */
  identifier: 'a9ced2559f43bf4d44',

  /**
   * 联系主页地址（形如 https://knocket.ai/yourname）
   * 填了才会在页脚显示 Contact 入口；留空则完全不渲染
   */
  contactPage: '',

  /** 降级邮箱。SDK 加载失败或超时时展示，避免访客无路可走 */
  fallbackEmail: '',

  /**
   * 加载时机
   * - click     : 用户点击按钮后才加载（默认，推荐）
   * - idle      : 页面 load 后浏览器空闲时加载（气泡自动出现）
   * - immediate : 随页面立即加载（仅适合纯客服站点，勿用于博客）
   */
  mode: 'idle' as 'click' | 'idle' | 'immediate',

  /** idle 模式下的最长等待时间（ms），超时即加载 */
  idleTimeout: 6000,

  /** 点击后等待 SDK 的提示阈值（ms），超时展示降级信息 */
  slowThreshold: 12000,

  /** 按钮文案（仅 click 模式生效） */
  label: 'Open live chat'
}
