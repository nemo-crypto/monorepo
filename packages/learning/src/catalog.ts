import type { Lesson } from '@demo/types';

/** 从零编写的教学数据，不请求远程服务。 */
export function createDemoLessons(): Lesson[] {
  return [
    { id: 'workspace', title: '工作区与包管理', minutes: 20 },
    { id: 'contracts', title: '共享类型与公共入口', minutes: 25 },
    { id: 'dependencies', title: '依赖方向与拓扑构建', minutes: 30 },
    { id: 'testing', title: '测试和持续集成', minutes: 25 },
  ];
}
