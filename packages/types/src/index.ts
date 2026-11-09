/** 共享契约只描述数据，不包含请求、状态或平台适配。 */
export interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly minutes: number;
}

export interface StudySummary {
  readonly totalLessons: number;
  readonly completedLessons: number;
  readonly totalMinutes: number;
  readonly completedMinutes: number;
  /** 按课时计算，范围 0..1；没有课程时为 0。 */
  readonly completionRate: number;
}
