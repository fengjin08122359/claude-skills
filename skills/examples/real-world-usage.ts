/**
 * Dev Advisor 实际使用示例
 * 
 * 注意: 这是一个示例文件，展示了如何在真实项目中集成和使用 Dev Advisor Skill 生态系统。
 * 其中的某些函数（如 invokeSkill）需要根据实际的 Skill 运行时实现。
 * 此文件主要用于演示 API 调用模式和最佳实践。
 * 
 * TypeScript 错误是预期的，因为这是伪代码示例，缺少实际的类型定义和实现。
 */

// @ts-nocheck - 这是示例代码，不需要严格的类型检查

import { invokeSkill } from '@lingma/skills'; // 需要根据实际实现调整
import type { KnownIssue, BestPractice, ExecutionPlan } from '../types';

// ==================== 示例 1: 日常代码审查 ====================

/**
 * 在保存文件时自动触发代码审查
 */
export async function onFileSave(filePath: string) {
  try {
    // 调用 dev-advisor 分析文件
    const analysis = await invokeSkill('dev-advisor', {
      action: 'analyze',
      filePath,
      options: {
        autoFix: false,  // 不自动修复，只报告问题
        severityThreshold: 'medium'  // 只显示中等及以上严重程度的问题
      }
    });

    // 如果有问题，显示给用户
    if (analysis.issues.length > 0) {
      showIssuesNotification(analysis.issues);

      // 询问是否修复
      const shouldFix = await askUser({
        message: `发现 ${analysis.issues.length} 个问题，是否查看并修复？`,
        options: ['查看并修复', '忽略', '稍后提醒']
      });

      if (shouldFix === '查看并修复') {
        await fixIssues(analysis.issues);
      }
    }
  } catch (error) {
    console.error('代码审查失败:', error);
  }
}

// ==================== 示例 2: 批量重构 ====================

/**
 * 批量重构项目中的某个模式
 * 例如：将所有 Options API 组件迁移到 Composition API
 */
export async function batchRefactor(pattern: string) {
  console.log('🔍 扫描需要重构的文件...');

  // 1. 查找匹配的文件
  const files = await findFilesByPattern(pattern);
  console.log(`找到 ${files.length} 个文件`);

  // 2. 分析每个文件
  const issues = [];
  for (const file of files) {
    const analysis = await invokeSkill('dev-advisor', {
      action: 'analyze',
      filePath: file,
      options: {
        focusOn: ['vue-anti-pattern']
      }
    });

    issues.push(...analysis.issues);
  }

  console.log(`发现 ${issues.length} 个需要重构的问题`);

  // 3. 生成重构计划
  const plan = await invokeSkill('dev-advisor', {
    action: 'generate-refactor-plan',
    issues,
    options: {
      strategy: 'incremental',  // 渐进式重构
      batchSize: 5  // 每批处理 5 个文件
    }
  });

  // 4. 执行重构（分批）
  for (let i = 0; i < plan.batches.length; i++) {
    const batch = plan.batches[i];

    console.log(`\n📦 执行批次 ${i + 1}/${plan.batches.length}`);

    const result = await invokeSkill('step-executor', {
      action: 'execute-batch',
      batch,
      options: {
        mode: 'safe',
        autoRetry: true
      }
    });

    console.log(`✅ 批次完成: ${result.summary.completedSteps}/${result.summary.totalSteps}`);

    // 批次间暂停，让用户检查
    if (i < plan.batches.length - 1) {
      await pauseForReview();
    }
  }

  console.log('🎉 批量重构完成！');
}

// ==================== 示例 3: Code Review 辅助 ====================

/**
 * 在 Code Review 时提供智能建议
 */
export async function codeReviewAssistant(prNumber: number) {
  console.log(`🔍 分析 PR #${prNumber}...`);

  // 1. 获取变更的文件列表
  const changedFiles = await getChangedFiles(prNumber);

  // 2. 分析每个文件
  const reviewComments = [];

  for (const file of changedFiles) {
    // 分析代码质量
    const analysis = await invokeSkill('dev-advisor', {
      action: 'analyze',
      filePath: file.path,
      options: {
        compareWithBase: true,  // 与基础分支对比
        onlyNewIssues: true     // 只显示新增的问题
      }
    });

    // 查询相关的最佳实践
    if (analysis.issues.length > 0) {
      const practices = await invokeSkill('best-practice-library', {
        action: 'find-relevant-practices',
        context: {
          detectedIssues: analysis.issues.map(i => i.category),
          techStack: { vue: '2.7', typescript: '4.9' }
        }
      });

      // 生成评论
      for (const issue of analysis.issues) {
        const relatedPractice = practices.practices.find(
          p => p.metadata.tags?.includes(issue.category)
        );

        reviewComments.push({
          file: file.path,
          line: issue.location?.line,
          comment: generateReviewComment(issue, relatedPractice)
        });
      }
    }
  }

  // 3. 提交评论到 PR
  await submitPRComments(prNumber, reviewComments);

  console.log(`✅ 提交了 ${reviewComments.length} 条评论`);
}

/**
 * 生成 Code Review 评论
 */
function generateReviewComment(issue: KnownIssue, practice?: BestPractice): string {
  let comment = `## ⚠️ ${issue.title}\n\n`;
  comment += `${issue.description}\n\n`;

  if (issue.solution) {
    comment += `**建议修复方案:**\n`;
    comment += issue.solution.summary + '\n\n';
  }

  if (practice) {
    comment += `**相关最佳实践:** [${practice.name}](link-to-practice)\n`;
    comment += `${practice.summary}\n\n`;
  }

  comment += `---\n*由 Dev Advisor 自动生成*`;

  return comment;
}

// ==================== 示例 4: 项目健康度报告 ====================

/**
 * 生成项目代码健康度报告
 */
export async function generateHealthReport(projectPath: string) {
  console.log('📊 生成项目健康度报告...');

  // 1. 扫描整个项目
  const allFiles = await scanDirectory(projectPath, '*.{ts,vue}');

  // 2. 统计各类问题
  const statistics = {
    totalFiles: allFiles.length,
    issuesBySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    issuesByCategory: {} as Record<string, number>,
    topIssues: [] as Array<{ title: string; count: number }>
  };

  // 3. 分析所有文件
  for (const file of allFiles) {
    const analysis = await invokeSkill('dev-advisor', {
      action: 'analyze',
      filePath: file,
      options: {
        quickMode: true  // 快速模式，只统计不详情
      }
    });

    // 累加统计
    for (const issue of analysis.issues) {
      statistics.issuesBySeverity[issue.severity]++;
      statistics.issuesByCategory[issue.category] =
        (statistics.issuesByCategory[issue.category] || 0) + 1;
    }
  }

  // 4. 从知识库获取高频问题
  const kbStats = await invokeSkill('issue-knowledge-base', {
    action: 'get-statistics',
    options: {
      timeRange: 'all'
    }
  });

  statistics.topIssues = kbStats.topFrequent.slice(0, 10);

  // 5. 计算健康度评分
  const healthScore = calculateHealthScore(statistics);

  // 6. 生成报告
  const report = {
    generatedAt: new Date().toISOString(),
    projectPath,
    healthScore,
    statistics,
    recommendations: generateRecommendations(statistics, healthScore)
  };

  // 7. 保存报告
  await saveReport(report, `health-report-${Date.now()}.json`);

  console.log(`✅ 健康度评分: ${healthScore}/100`);
  console.log('📄 报告已保存');

  return report;
}

/**
 * 计算健康度评分
 */
function calculateHealthScore(stats: any): number {
  const totalIssues = Object.values(stats.issuesBySeverity).reduce((a, b) => a + b, 0);

  if (totalIssues === 0) return 100;

  // 加权计算
  const weightedIssues =
    stats.issuesBySeverity.critical * 10 +
    stats.issuesBySeverity.high * 5 +
    stats.issuesBySeverity.medium * 2 +
    stats.issuesBySeverity.low * 1;

  const score = Math.max(0, 100 - (weightedIssues / stats.totalFiles) * 10);

  return Math.round(score);
}

/**
 * 生成改进建议
 */
function generateRecommendations(stats: any, healthScore: number): string[] {
  const recommendations = [];

  if (stats.issuesBySeverity.critical > 0) {
    recommendations.push('🔴 优先修复严重问题，它们可能导致运行时错误');
  }

  if (stats.issuesByCategory['type-safety'] > 10) {
    recommendations.push('💡 类型安全问题较多，建议加强 TypeScript 使用规范');
  }

  if (stats.issuesByCategory['vue-anti-pattern'] > 5) {
    recommendations.push('🔄 Vue 反模式较多，考虑迁移到 Composition API');
  }

  if (healthScore < 60) {
    recommendations.push('⚠️ 项目健康度较低，建议制定专项改进计划');
  }

  return recommendations;
}

// ==================== 示例 5: 持续学习系统 ====================

/**
 * 从团队实践中学习并更新知识库
 */
export async function learnFromTeamPractices() {
  console.log('🧠 从团队实践中学习...');

  // 1. 分析最近的成功合并
  const recentMerges = await getRecentMerges(30); // 最近 30 天

  // 2. 提取成功的模式
  const successfulPatterns = [];

  for (const merge of recentMerges) {
    // 分析合并的代码
    const analysis = await invokeSkill('dev-advisor', {
      action: 'analyze-quality',
      commitHash: merge.commitHash,
      options: {
        lookForGoodPatterns: true  // 寻找好的模式
      }
    });

    if (analysis.goodPatterns.length > 0) {
      successfulPatterns.push(...analysis.goodPatterns);
    }
  }

  // 3. 将新模式添加到最佳实践库
  for (const pattern of successfulPatterns) {
    // 检查是否已存在
    const existing = await invokeSkill('best-practice-library', {
      action: 'search-practices',
      query: pattern.name
    });

    if (!existing.practices.length) {
      // 添加新模式
      await invokeSkill('best-practice-library', {
        action: 'add-practice',
        practice: {
          name: pattern.name,
          summary: pattern.summary,
          category: pattern.category,
          implementation: pattern.implementation,
          metadata: {
            source: 'team-practice-learning',
            confidence: 'medium',
            usageCount: 1,
            status: 'experimental'
          }
        },
        options: {
          requireApproval: true  // 需要审核
        }
      });

      console.log(`✨ 发现新模式: ${pattern.name}`);
    }
  }

  console.log('✅ 学习完成！');
}

// ==================== 示例 6: 自定义工作流 ====================

/**
 * 创建自定义的代码质量工作流
 */
export async function customQualityWorkflow(config: {
  projectPath: string;
  rules: string[];
  autoFix: boolean;
  generateReport: boolean;
}) {
  console.log('🚀 启动自定义质量工作流...');

  const { projectPath, rules, autoFix, generateReport } = config;

  // 1. 配置检查规则
  await invokeSkill('dev-advisor', {
    action: 'configure-checks',
    rules,
    scope: 'project'
  });

  // 2. 执行全面检查
  const analysis = await invokeSkill('dev-advisor', {
    action: 'analyze-project',
    projectPath,
    options: {
      parallel: true,  // 并行分析
      maxConcurrency: 4
    }
  });

  console.log(`📋 发现 ${analysis.issues.length} 个问题`);

  // 3. 如果需要，自动修复
  if (autoFix && analysis.fixableIssues.length > 0) {
    console.log('🔧 开始自动修复...');

    const plan = await invokeSkill('dev-advisor', {
      action: 'generate-fix-plan',
      issues: analysis.fixableIssues
    });

    const result = await invokeSkill('step-executor', {
      action: 'execute-plan',
      plan,
      options: {
        mode: 'fast',
        autoRetry: true
      }
    });

    console.log(`✅ 修复完成: ${result.summary.completedSteps} 个步骤`);
  }

  // 4. 生成报告
  if (generateReport) {
    const report = await generateHealthReport(projectPath);

    // 发送到指定位置
    await sendReport(report, {
      format: 'html',
      recipients: ['team@example.com'],
      includeCharts: true
    });
  }

  console.log('✅ 工作流完成！');
}

// ==================== 工具函数 ====================

async function showIssuesNotification(issues: any[]) {
  // 实现通知逻辑
  console.log(`发现 ${issues.length} 个问题`);
}

async function askUser(options: any): Promise<string> {
  // 实现用户交互
  return '查看并修复';
}

async function fixIssues(issues: any[]) {
  // 实现修复逻辑
}

async function findFilesByPattern(pattern: string): Promise<string[]> {
  // 实现文件查找
  return [];
}

async function pauseForReview() {
  // 等待用户确认
  return new Promise(resolve => setTimeout(resolve, 1000));
}

async function getChangedFiles(prNumber: number) {
  // 获取 PR 变更文件
  return [];
}

async function submitPRComments(prNumber: number, comments: any[]) {
  // 提交 PR 评论
}

async function scanDirectory(path: string, pattern: string): Promise<string[]> {
  // 扫描目录
  return [];
}

async function saveReport(report: any, filename: string) {
  // 保存报告
}

async function getRecentMerges(days: number) {
  // 获取最近的合并
  return [];
}

async function sendReport(report: any, options: any) {
  // 发送报告
}
