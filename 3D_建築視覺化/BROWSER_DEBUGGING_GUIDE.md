# 🔧 浏览器调试完整指南

**问题**: 点击楼层按钮后，主画面没有变化

**原因可能**: 浏览器缓存、JavaScript 错误、或事件处理未连接

---

## 📋 调试步骤 (按顺序执行)

### 步骤 1: 清除浏览器缓存并硬刷新

1. **打开开发者工具**: 按 `F12`
2. **清除缓存**:
   - Windows/Linux: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
3. **选择**:
   - 时间范围: "所有时间" 或 "过去1小时"
   - 勾选: Cookies、缓存的图片和文件
   - 点击: "清除数据"
4. **硬刷新页面**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

---

### 步骤 2: 打开浏览器控制台检查错误

1. **打开开发者工具**: `F12`
2. **切换到 "Console" 标签**
3. **查找错误消息** (红色文本):
   ```
   ❌ 如果你看到这样的消息:
   - "selectFloor is not defined"
   - "currentFloor is not defined"
   - "TypeError: Cannot read property..."
   ```
   **说明**: JavaScript 初始化有问题

4. **查找初始化消息** (绿色文本):
   ```
   ✅ 应该看到这样的消息:
   - "✅ Three.js 已加載"
   - "🏗️ 初始化 Three.js 場景..."
   - "✅ 初始化完成，3D 建築應該出現了"
   ```

---

### 步骤 3: 测试楼层按钮

1. **保持开发者工具开启** (Console 标签可见)
2. **点击一个楼层按钮** (例如 "2F 托嬰+SIDS監測")
3. **观察 Console**:
   - 应该看到任何 JavaScript 错误
   - 或看到按钮的回显

4. **检查主画面**:
   - 房间列表是否变化?
   - 右侧信息面板是否更新?
   - 按钮的 "active" 样式是否改变?

---

### 步骤 4: 检查网络请求

1. **打开开发者工具**: `F12`
2. **切换到 "Network" 标签**
3. **刷新页面**
4. **查找 HTML 响应**:
   - 应该看到一个 `document` 条目
   - 响应代码应该是 `200`
   - 检查大小是否合理 (~45 KB)

5. **检查加载的脚本**:
   - 应该看到 `three.module.js` 加载
   - 应该看到 `OrbitControls.js` 加载
   - 应该看到 `PointerLockControls.js` 加载

---

### 步骤 5: 手动测试 JavaScript 函数

在 Console 中输入以下命令 (逐行):

```javascript
// 测试 1: 检查全局变量是否存在
typeof selectFloor
typeof currentFloor
typeof ROOM_DATA

// 测试 2: 尝试调用楼层选择函数
selectFloor('2F')

// 测试 3: 检查当前楼层
console.log('当前楼层:', currentFloor)

// 测试 4: 检查房间数据
console.log('2F 房间数:', ROOM_DATA['2F'].length)
console.log('房间列表 HTML:', document.getElementById('rooms-list').innerHTML)
```

---

## 🔍 常见问题与解决方案

### 问题 1: "selectFloor is not defined"

**原因**: JavaScript 代码未被加载或执行

**解决方案**:
1. 检查网络标签中是否加载了主 HTML
2. 查看 HTML 中是否包含 `<script>` 标签
3. 确保没有 syntax 错误阻止了脚本执行

### 问题 2: 按钮点击后没有反应

**原因**: 可能是:
- onclick 属性未被正确设置
- JavaScript 函数存在但有错误
- 浏览器缓存

**解决方案**:
1. 硬刷新 (Ctrl+Shift+R)
2. 打开 Console 检查错误
3. 检查按钮的 HTML:
   ```html
   <button onclick="selectFloor('2F')">...</button>
   ```

### 问题 3: 房间列表没有显示

**原因**: `updateRoomsList()` 函数没有正确执行

**解决方案**:
1. 在 Console 中手动测试: `updateRoomsList()`
2. 检查 `ROOM_DATA[currentFloor]` 是否有数据
3. 检查 `rooms-list` 元素是否存在: `document.getElementById('rooms-list')`

### 问题 4: 3D 场景不显示

**原因**: Three.js 加载失败

**解决方案**:
1. 检查 Console 中是否有加载错误
2. 检查 Network 标签中 `three.module.js` 是否加载成功
3. 检查 `libs/three/` 目录中的文件是否存在

---

## ✅ 成功的标志

当一切正常工作时，你应该看到:

```
✅ Console 中没有错误 (红色消息)
✅ 初始化消息显示成功
✅ 点击楼层按钮后:
   - 按钮样式改变 (变亮)
   - 房间列表更新
   - 右侧信息面板显示新楼层的数据
   - 3D 场景保持渲染
✅ Network 标签显示所有资源加载成功 (绿色 200 状态)
```

---

## 🚀 如果一切都失败了

1. **完全关闭浏览器**
2. **运行这个命令清除所有浏览器数据**:
   ```bash
   # Windows: 删除缓存
   rm -rf %LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*
   ```
3. **重新启动服务器**:
   ```bash
   cd 3D_建築視覺化
   node server.js
   ```
4. **用隐身模式打开浏览器**:
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`
   - Edge: `Ctrl + Shift + InPrivate`
5. **访问**: `http://localhost:8080`

---

## 📞 需要帮助?

如果完成了所有调试步骤后仍有问题，请告诉我:

1. **Console 中看到了什么错误?** (复制粘贴完整的错误信息)
2. **Network 标签中哪些资源加载失败?** (列出状态非 200 的请求)
3. **手动调用 `selectFloor('2F')` 后发生了什么?**
4. **ROOM_DATA 是否存在?** (在 Console 中输入 `ROOM_DATA`)

---

**下一步**: 按照上述步骤操作，然后告诉我在 Console 中看到了什么。这将帮助我们找出真正的问题。
