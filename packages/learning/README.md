# @demo/learning

创建演示课程、生成每日学习计划、汇总课时进度。只依赖 @demo/types 和 @demo/utils，由两个应用共同消费。

调用方统一从 `@demo/learning` 导入。源码入口 `src/index.ts` 汇总公开 API，`src/catalog.ts` 提供演示课程，`src/study.ts` 负责课程校验、计划和进度计算。
