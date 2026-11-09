import { createDemoLessons, createStudyPlan } from '@demo/learning';

// 应用只负责输入和展示，课程规则由共享包负责。
const plan = createStudyPlan(createDemoLessons(), 2);
console.log('学习计划 · 每天两节课');
plan.forEach((lessons, index) => {
  console.log(`第 ${index + 1} 天：${lessons.map((lesson) => lesson.title).join('、')}`);
});
