async function matchCandidatesToCourses(candidates, courses) {
  let assignments = [];
  // For each course, choose the candidate with the best score based on dummy criteria.
  for (let course of courses) {
    let bestCandidate = null;
    let bestScore = 0;
    let reasoning = '';
    for (let candidate of candidates) {
      let score = 0;
      // Increase score if candidate's degree matches the course criteria.
      if (candidate.degree && course.criteria && course.criteria.degree) {
        if (candidate.degree.toLowerCase().includes(course.criteria.degree.toLowerCase())) {
          score += 50;
        }
      }
      // Score GPA proportionally (assumes course.criteria.gpa is a minimum requirement).
      if (candidate.gpa && course.criteria && course.criteria.gpa) {
        score += Math.min(candidate.gpa, course.criteria.gpa) / course.criteria.gpa * 50;
      }
      // Additional scoring can be added based on skills, work experience, etc.
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
        reasoning = `Candidate matches degree requirement and meets GPA criteria. Score: ${score}`;
      }
    }
    if (bestCandidate) {
      assignments.push({
        candidateId: bestCandidate.id,
        courseId: course.id,
        score: bestScore,
        reasoning: reasoning
      });
    }
  }
  return assignments;
}

export default matchCandidatesToCourses;
