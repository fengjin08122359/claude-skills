// 全局设置 - 在每个测试文件运行前执行
module.exports = async () => {
  console.log('=== 全局设置启动 ===');

  // 可以在这里进行全局初始化
  // 例如：启动测试数据库、创建测试用户等

  // 设置全局环境变量
  process.env.TEST_ENV = 'true';

  console.log('=== 全局设置完成 ===');
};
