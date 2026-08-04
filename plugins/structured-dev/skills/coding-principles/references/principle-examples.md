# 编码原则应用示例

## 规则 1：编码前先思考

### 错误做法

```typescript
// 直接开始写，没有思考
function processData(data: any) {
  return data.map(item => transform(item));
}
```

### 正确做法

```markdown
## 编码前思考

**假设：**
- 输入数据是数组格式
- 每个元素都有 transform 所需的字段
- 数据量在 1000 条以内

**不确定点：**
- ❓ 空数组如何处理？返回空数组还是报错？
- ❓ 数据量超过 1000 条时的性能表现？

**权衡：**
- 方案 A：直接处理，简单但可能内存溢出
- 方案 B：分批处理，复杂但安全
- **推荐方案 B**，数据量不确定时更安全
```

---

## 规则 2：简洁优先

### 过度实现

```typescript
// 用户没要求的域名检查和 MX 记录检查
function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableDomains = ['tempmail.com', 'throwaway.com'];
  if (disposableDomains.includes(email.split('@')[1])) {
    return { valid: false, error: 'Disposable email not allowed' };
  }
  // ...更多代码...
}
```

### 简洁版本

```typescript
// 只做要求的：验证邮箱格式
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 规则 3：外科手术式修改

### 错误做法

```diff
// 原任务：修复登录验证 bug
function login(username: string, password: string) {
-  // 原有注释，顺便删掉
-  if (!username || !password) {
+  // 我重新写的注释，更清晰
+  if (!username || !password || username.length < 3) { // 顺便加长度检查
     return { error: 'Missing credentials' };
   }
-  return validateUser(user, password);
+  return checkUser(user, password);  // 顺便改了函数名
}
```

### 正确做法

```diff
// 只修复 bug
function login(username: string, password: string) {
   if (!username || !password) {
      return { error: 'Missing credentials' };
   }
   const user = db.findUser(username);
-  return validateUser(user, password);  // bug: 密码验证逻辑错误
+  return validateUser(user, password, { strictMode: true });
}
```

---

## 规则 4：目标驱动执行

### 错误做法

```
AI："好的，我会：1. 找到代码 2. 读取代码 3. 分析 4. 修改 5. 保存"
AI 执行完步骤 5 后停止："我已经修改了代码。"
用户："还是报错..."
```

### 正确做法

```
AI："成功标准：用户可以正常登录，无报错。"
AI 修改 → 测试 → 失败 → 修复 → 再测试 → 通过 → 手动验证 → 成功
AI："登录 bug 已修复，验证通过。"
```
