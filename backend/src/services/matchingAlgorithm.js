import hungarianAlgorithm from 'munkres-js';

async function matchCandidatesToCourses() {
  try {
    const pool = req.app.locals.pool;
    
    // Retrieve courses and candidates.
    const [courses] = await pool.query('SELECT * FROM courses c WHERE NOT EXISTS(SELECT 1 FROM assignments a WHERE a.course_id = c.id)');
    const [candidates] = await pool.query('SELECT * FROM applicants c WHERE NOT EXISTS(SELECT 1 FROM assignments a WHERE a.applicant_net_id = c.net_id)');
    //const [recommendations] = await pool.query('SELECT * FROM recommendations');

    // Build cost matrix: lower cost indicates a better match.
    // For each course, compute cost for every candidate.
    var matches = 0;
    const costMatrix = await Promise.all(courses.map(async course => {
      return await Promise.all(candidates.map(async candidate => {
        let cost = 1000; // default high cost for ineligible candidates
        //if (candidate.continuing) with prof, stay with prof

        // if the professor requests a specific grader, set score to 0
        if (course.recommendedStudentNetid === candidate.net_id)
          cost = 0;

        else {
          if(candidate.qualified) {
            cost -= 500;
          }
         
          //for each skill -= 5
          matches = await pool.query(
            `SELECT COUNT(*) AS match_count
             FROM course_skills c
             INNER JOIN applicant_skills a
             ON c.skill = a.skill
             AND c.skill_type = a.skilltype;
             AND c.course_id = ?
             AND a.applicant_net_id = ?,`
            [course.id, applicant.net_id]
          );
          cost -= matches.rows[0].match_count * 5;

          // GPA boost
          cost -= 2 * candidate.GPA;
        }
        if(cost < 0)
          cost = 0;

        return cost;
      }));
    }));

    // Compute assignments using the Hungarian algorithm.
    // assignmentsIndices is an array: each element is a course/applicant pair, by index in their respective arrays
    const assignmentsIndices = hungarianAlgorithm(costMatrix);

    console.log(assignmentsIndices);

    const assignments = [];
    // Clear previous assignments.

    // Use a standard for-loop to support await.
    for (let i = 0; i < assignmentsIndices.length; i++) {
      const candidateIndex = assignmentsIndices[i][1];
      const courseIndex = assignmentsIndices[i][0];
      const course = courses[courseIndex];
      const candidate = candidates[candidateIndex];

      assignments.push({
        course_id: course.id,
        course_name: course.courseName,
        candidate_id: candidate.net_id,
        candidate_name: candidate.applicant_name,
      });
    }
    
    
    res.json({ message: 'Matching completed successfully.', assignments });
  } catch (error) {
    console.error('Error during matching:', error);
    res.status(500).json({ error: 'Error running matching algorithm.' });
  }

  return assignments;
}

export default matchCandidatesToCourses;
