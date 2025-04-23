// src/utils/transformApplicant.js

/**
 * Returns a "lightweight" version of the applicant data by removing
 * the detailed job experience descriptions.
 *
 * @param {Object} applicant - The applicant object (as plain JSON)
 * @returns {Object} The applicant object without the "description" in each experience entry.
 */
function transformApplicantForListing(applicant) {
  const transformApplicant = { ...applicant };

  if (Array.isArray(transformApplicant.experience)) {
    transformApplicant.experience = transformApplicant.experience.map(exp => {
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
  
  return transformApplicant;
}

/**
 * Returns an array of lightweight applicant objects.
 * @param {Array<Object>} applicants - Array of applicant objects.
 * @returns {Array<Object>} Transformed array.
 */
function transformApplicantsForListing(applicants) {
  return applicants.map(applicant => transformApplicantForListing(applicant));
}

export default { transformApplicantsForListing }