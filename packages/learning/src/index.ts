import type { Lesson, StudySummary } from '@demo/types';
import { chunk } from '@demo/utils';

/** 从零编写的教学数据，不请求远程服务。 */
export function createDemoLessons(): Lesson[] {
  return [
    { id: 'workspace', title: '工作区与包管理', minutes: 20 },
    { id: 'contracts', title: '共享类型与公共入口', minutes: 25 },
    { id: 'dependencies', title: '依赖方向与拓扑构建', minutes: 30 },
    { id: 'testing', title: '测试和持续集成', minutes: 25 },
  ];
}

function validateLessons(lessons: readonly Lesson[]): void {
  const seen = new Set<string>();
  let total = 0;
  for (const lesson of lessons) {
    if (!lesson.id.trim() || seen.has(lesson.id) || !lesson.title.trim()) {
      throw new TypeError('课程 id 必须非空且唯一，标题不能为空');
    }
    if (!Number.isSafeInteger(lesson.minutes) || lesson.minutes < 1) {
      throw new RangeError('课程时长必须是正安全整数');
    }
    seen.add(lesson.id);
    total += lesson.minutes;
    if (!Number.isSafeInteger(total)) throw new RangeError('课程总时长超出安全整数范围');
  }
}

export function createStudyPlan(lessons: readonly Lesson[], lessonsPerDay: number): Lesson[][] {
  validateLessons(lessons);
  return chunk(lessons, lessonsPerDay);
}

/** 重复完成记录只计一次；未知 id 明确报错。 */
export function summarizeProgress(lessons: readonly Lesson[], completedIds: readonly string[]): StudySummary {
  validateLessons(lessons);
  const completed = new Set(completedIds);
  const known = new Set(lessons.map((lesson) => lesson.id));
  for (const id of completed) {
    if (!known.has(id)) throw new RangeError(`未知课程 id: ${id}`);
  }
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  const completedMinutes = lessons.reduce((sum, lesson) => sum + (completed.has(lesson.id) ? lesson.minutes : 0), 0);
  return {
    totalLessons: lessons.length,
    completedLessons: completed.size,
    totalMinutes,
    completedMinutes,
    completionRate: totalMinutes === 0 ? 0 : completedMinutes / totalMinutes,
  };
}
