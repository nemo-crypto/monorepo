import type { Lesson, StudySummary } from '@demo/types';
import { createStudyPlan, summarizeProgress } from '@demo/learning';
import { chunk } from '@demo/utils';

const lesson: Lesson = { id: 'a', title: 'TypeScript', minutes: 20 };
const summary: StudySummary = summarizeProgress([lesson], ['a']);
const plan: Lesson[][] = createStudyPlan([lesson], 1);
const groups: number[][] = chunk([1, 2] as const, 1);
void summary; void plan; void groups;
// @ts-expect-error 共享契约使用数字分钟。
const invalid: Lesson = { id: 'a', title: 'TypeScript', minutes: '20' };
void invalid;
// @ts-expect-error 公开课程数据是只读属性。
lesson.title = 'changed';
// @ts-expect-error 完成记录必须是课程 id。
summarizeProgress([lesson], [42]);
