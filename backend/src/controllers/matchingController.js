const hungarianAlgorithm = require('munkres-js');

exports.runMatching = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    
    // Retrieve courses and candidates.
    const [courses] = await pool.query('SELECT * FROM courses');
    const [candidates] = await pool.query('SELECT * FROM candidates');
    
    // Build cost matrix: lower cost indicates a better match.
    // For each course, compute cost for every candidate.
    const costMatrix = courses.map(course => {
      return candidates.map(candidate => {
        let cost = 1000; // default high cost for ineligible candidates
        if (candidate.major === course.required_major && candidate.gpa >= course.min_gpa) {
          cost = 100 - candidate.gpa * 10;
          if (candidate.is_continuing) cost -= 10;
          // Bonus for having taken the course.
          if (candidate.courses_taken) {
            const coursesArray = candidate.courses_taken.split(',').map(c => c.trim().toLowerCase());
            if (coursesArray.includes(course.course_name.toLowerCase())) {
              cost -= 5;
            }
          }
          // If this candidate is recommended, assign best cost.
          if (course.recommended_candidate_id && candidate.id === course.recommended_candidate_id) {
            cost = 0;
          }
        }
        return cost;
      });
    });

    // Compute assignments using the Hungarian algorithm.
    // assignmentsIndices is an array: each element is the candidate index assigned to that course index.
    const assignmentsIndices = hungarianAlgorithm(costMatrix);

    const assignments = [];
    // Clear previous assignments.
    await pool.query('DELETE FROM assignments');
    
    // Use a standard for-loop to support await.
    for (let courseIndex = 0; courseIndex < assignmentsIndices.length; courseIndex++) {
      const candidateIndex = assignmentsIndices[courseIndex];
      const course = courses[courseIndex];
      const candidate = candidates[candidateIndex];
      let explanation = '';

      if (candidate && candidate.major === course.required_major && candidate.gpa >= course.min_gpa) {
        if (candidate.is_continuing) {
          explanation = `Continuing candidate ${candidate.name} selected with GPA ${candidate.gpa}.`;
        } else if (course.recommended_candidate_id === candidate.id) {
          explanation = `Candidate ${candidate.name} selected as recommended by professor.`;
        } else {
          if (candidate.courses_taken) {
            const coursesArray = candidate.courses_taken.split(',').map(c => c.trim().toLowerCase());
            if (coursesArray.includes(course.course_name.toLowerCase())) {
              explanation = `Candidate ${candidate.name} selected based on optimal score with bonus for relevant course.`;
            } else {
              explanation = `Candidate ${candidate.name} selected based on optimal score.`;
            }
          } else {
            explanation = `Candidate ${candidate.name} selected based on optimal score.`;
          }
        }
      } else {
        explanation = 'No eligible candidate found.';
      }
      
      // Insert the assignment into the database.
      await pool.query(
        'INSERT INTO assignments (course_id, candidate_id, explanation) VALUES (?, ?, ?)',
        [course.id, candidate ? candidate.id : null, explanation]
      );
      
      assignments.push({
        course_id: course.id,
        course_name: course.course_name,
        candidate_id: candidate ? candidate.id : null,
        candidate_name: candidate ? candidate.name : null,
        explanation
      });
    }
    
    res.json({ message: 'Matching completed successfully.', assignments });
  } catch (error) {
    console.error('Error during matching:', error);
    res.status(500).json({ error: 'Error running matching algorithm.' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const [rows] = await pool.query(
      `SELECT a.id, c.course_name, can.name as candidate_name, a.explanation
       FROM assignments a
       LEFT JOIN courses c ON a.course_id = c.id
       LEFT JOIN candidates can ON a.candidate_id = can.id`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Error fetching assignments' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const assignmentId = req.params.assignmentId;
    const { candidate_id, explanation } = req.body;
    
    // Validate that the candidate exists.
    const [candidateRows] = await pool.query('SELECT * FROM candidates WHERE id = ?', [candidate_id]);
    if (candidateRows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    await pool.query('UPDATE assignments SET candidate_id = ?, explanation = ? WHERE id = ?', [candidate_id, explanation, assignmentId]);
    res.json({ message: 'Assignment updated successfully.' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Error updating assignment' });
  }
};

exports.exportMatching = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const [assignments] = await pool.query(
      `SELECT a.id, c.course_name, can.name as candidate_name, a.explanation
       FROM assignments a
       LEFT JOIN courses c ON a.course_id = c.id
       LEFT JOIN candidates can ON a.candidate_id = can.id`
    );
    let csv = 'Assignment ID,Course Name,Candidate Name,Explanation\n';
    assignments.forEach(assignment => {
      csv += `${assignment.id},${assignment.course_name},${assignment.candidate_name || ''},${assignment.explanation}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="assignments.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting assignments:', error);
    res.status(500).json({ error: 'Error exporting assignments.' });
  }
};
