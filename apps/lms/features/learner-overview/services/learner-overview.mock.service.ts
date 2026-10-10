import { LEARNER_EXERCISES } from "../../learner-exercises/data/learner-exercises.mock";
import { getLearnerClassSummaries } from "../../learner-classes/services/learner-classes.mock.service";

const FINISHED = new Set(["submitted", "reviewed"]);

export function getLearnerLearningReport() {
  return getLearnerClassSummaries().map((summary) => {
    const exercises = LEARNER_EXERCISES.filter((item) => item.classId === summary.classInfo.id);
    return {
      ...summary,
      exerciseCount: exercises.length,
      finishedExerciseCount: exercises.filter((item) => FINISHED.has(item.status)).length,
    };
  });
}
