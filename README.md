# 场馆计时器 (Venue Timer)

一个为射箭场馆（也可以用于其他同类型计费场馆）设计的场馆计时器应用程序，使用Tauri框架和Vue 3开发的跨平台桌面应用。

## 功能特点

- **多用户支持**：可同时管理多个计时器，适合团队训练和比赛场景
- **灵活的计时模式**：
  - 倒计时模式：适用于比赛和限时训练
  - 正计时模式：适用于持续时间记录
- **会员与非会员区分**：支持区分会员和非会员用户
- **丰富的计时控制**：
  - 暂停/继续功能
  - 为倒计时增加额外时间
  - 提前结束计时
- **声音提示**：计时结束时播放提示音（可开关）
- **数据持久化**：自动保存计时器状态，应用重启后恢复
- **优雅的界面**：简洁直观的用户界面，一目了然的计时状态显示

## 界面截图

![界面截图](https://github.com/disfeng/venue-timer/blob/main/screenshot/main.jpg)

## 安装说明

### 直接下载

从[发布页面](https://github.com/disfeng/venue-timer/releases)下载适合您系统的安装包：

- Windows: `.msi` 或 `.exe`
- macOS: `.dmg`

### 从源代码构建

1. 确保已安装Node.js (v16+)和Rust环境
2. 克隆仓库：

```sh
git clone https://github.com/disfeng/venue-timer.git
cd venue-timer
```

3. 安装依赖：

```sh
npm install
```

4. 开发模式运行：

```sh
npm run tauri dev
```

5. 构建应用程序：

```sh
npm run tauri build
```

## 使用指南

1. **添加计时器**：

   - 选择用户类型（会员/非会员）
   - 输入用户标识
   - 选择计时类型（倒计时/正计时）
   - 对于倒计时，设置所需时长
   - 点击"添加计时器"按钮

2. **控制计时器**：

   - 暂停/继续：临时暂停计时
   - 增加时间：为倒计时增加30分钟或1小时
   - 结束：提前结束计时
   - 删除：移除已完成的计时器

3. **声音控制**：
   - 点击声音按钮开启/关闭计时结束提示音

## 技术栈

- [Tauri](https://tauri.app/): 跨平台应用程序框架
- [Vue 3](https://vuejs.org/): 前端框架
- [Element Plus](https://element-plus.org/): UI组件库
- [TypeScript](https://www.typescriptlang.org/): 类型安全的JavaScript超集
- [Vite](https://vitejs.dev/): 前端构建工具

## 贡献指南

欢迎对本项目进行贡献！请按照以下步骤参与：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请查看[LICENSE](LICENSE)文件

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- GitHub Issues: [https://github.com/disfeng/venue-timer/issues](https://github.com/disfeng/venue-timer/issues)

---

感谢使用场馆计时器！希望它能够帮助您更好地管理场馆训练和比赛时间。
