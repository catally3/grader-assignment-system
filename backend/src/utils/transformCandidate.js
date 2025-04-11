// src/utils/transformCandidate.js

/**
 * Returns a "lightweight" version of the candidate data by removing
 * the detailed job experience descriptions.
 *
 * @param {Object} candidate - The candidate object (as plain JSON)
 * @returns {Object} The candidate object without the "description" in each experience entry.
 */
function transformCandidateForListing(candidate) {
  const transformedCandidate = { ...candidate };

  if (Array.isArray(transformedCandidate.experience)) {
    transformedCandidate.experience = transformedCandidate.experience.map(exp => {
      // Return a copy of the experience entry without the "description" field.
      const { description, ...lightExp } = exp;
      return lightExp;
    });
  }
  // Optionally, you can also transform the skills field if needed.
  // For example, if you want skills as a comma separated string:
  // transformedCandidate.skills = Array.isArray(transformedCandidate.skills)
  //   ? transformedCandidate.skills.join(', ')
  //   : transformedCandidate.skills;
  
  return transformedCandidate;
}

/**
 * Returns an array of lightweight candidate objects.
 * @param {Array<Object>} candidates - Array of candidate objects.
 * @returns {Array<Object>} Transformed array.
 */
function transformCandidatesForListing(candidates) {
  return candidates.map(candidate => transformCandidateForListing(candidate));
}

export default { transformCandidatesForListing }