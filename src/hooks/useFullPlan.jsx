import { useEffect, useState } from "react";

const useFullPlan = (currentWorkout) => {
  const [fullPlan, setFullPlan] = useState({});

  useEffect(() => {
    if (currentWorkout?.plan) {
      const fullPlanAlgorithm = currentWorkout.plan.flatMap((exercise) => {
        return Array.from(
          { length: parseInt(exercise.sets, 10) },
          (_, index) => ({
            ...exercise,
            set: index + 1,
            uniqueId: `${exercise.id}-${index + 1}`,
          })
        );
      });

      setFullPlan(fullPlanAlgorithm);
    }
  }, [currentWorkout]);

  return fullPlan;
};

export default useFullPlan;
