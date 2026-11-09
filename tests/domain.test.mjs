import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoLessons, createStudyPlan, summarizeProgress } from '@demo/learning';
import { chunk, formatPercent } from '@demo/utils';

test('分组保持输入顺序且不修改原数组', () => {
  const input = Object.freeze([1, 2, 3]);
  assert.deepEqual(chunk(input, 2), [[1, 2], [3]]);
  assert.deepEqual(chunk([], 2), []);
  for (const size of [0, -1, 1.5, Infinity]) assert.throws(() => chunk(input, size), RangeError);
});

test('百分比格式与非法输入', () => {
  assert.equal(formatPercent(0.45), '45.0%');
  assert.equal(formatPercent(0), '0.0%');
  assert.equal(formatPercent(1), '100.0%');
  for (const rate of [-0.1, 1.1, NaN, Infinity]) assert.throws(() => formatPercent(rate), RangeError);
});

test('学习计划由独立领域包生成', () => {
  const lessons = createDemoLessons();
  assert.equal(createStudyPlan(lessons, 2).length, 2);
  assert.deepEqual(createStudyPlan(lessons, 3).map((day) => day.length), [3, 1]);
  assert.deepEqual(createStudyPlan([], 2), []);
  assert.throws(() => createStudyPlan(lessons, 0), RangeError);
  lessons[0].title = 'changed';
  assert.equal(createDemoLessons()[0].title, '工作区与包管理');
});

test('进度按课时计算，重复完成记录不重复计数', () => {
  assert.deepEqual(summarizeProgress(createDemoLessons(), ['workspace', 'contracts', 'workspace']), {
    totalLessons: 4, completedLessons: 2, totalMinutes: 100, completedMinutes: 45, completionRate: 0.45,
  });
  assert.equal(summarizeProgress([], []).completionRate, 0);
  assert.throws(() => summarizeProgress(createDemoLessons(), ['unknown']), /未知课程/);
});

test('课程契约拒绝重复 id、空标题和无效时长', () => {
  const lesson = { id: 'a', title: 'Lesson', minutes: 10 };
  assert.throws(() => createStudyPlan([lesson, lesson], 1), /唯一/);
  assert.throws(() => createStudyPlan([{ ...lesson, title: ' ' }], 1), /标题/);
  for (const minutes of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => summarizeProgress([{ ...lesson, minutes }], []), RangeError);
  }
  assert.throws(() => summarizeProgress([
    { ...lesson, minutes: Number.MAX_SAFE_INTEGER },
    { ...lesson, id: 'b' },
  ], []), /总时长/);
});

test('包 exports 阻止消费方穿透内部文件', async () => {
  await assert.rejects(import('@demo/learning/dist/index.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
});
