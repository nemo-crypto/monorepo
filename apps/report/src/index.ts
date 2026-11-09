import { createDemoLessons, summarizeProgress } from '@demo/learning';
import { formatPercent } from '@demo/utils';

const summary = summarizeProgress(createDemoLessons(), ['workspace', 'contracts']);
console.log('学习进度报告');
console.log(`完成课程：${summary.completedLessons}/${summary.totalLessons}`);
console.log(`完成课时：${summary.completedMinutes}/${summary.totalMinutes} 分钟`);
console.log(`课时进度：${formatPercent(summary.completionRate)}`);
