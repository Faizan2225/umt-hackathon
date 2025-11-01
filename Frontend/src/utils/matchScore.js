/**
 * Match Score Algorithm
 * Calculates compatibility between a job seeker and a job posting
 * This demonstrates engineering logic and algorithmic thinking
 */

/**
 * Calculate match score between user profile and job posting
 * @param {Object} userProfile - User's profile with skills, interests, experience
 * @param {Object} jobPost - Job posting with requirements, skills, description
 * @returns {Object} Match score and breakdown
 */
export const calculateMatchScore = (userProfile, jobPost) => {
  if (!userProfile || !jobPost) {
    return { score: 0, breakdown: {} };
  }

  const breakdown = {
    skills: 0,
    experience: 0,
    interests: 0,
    education: 0,
    location: 0,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  // 1. Skills Match (40% weight)
  if (jobPost.requiredSkills && userProfile.skills) {
    const userSkills = userProfile.skills.map((s) => s.toLowerCase());
    const requiredSkills = jobPost.requiredSkills.map((s) => s.toLowerCase());
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.some((userSkill) => userSkill.includes(skill) || skill.includes(userSkill))
    );
    const skillsScore = (matchedSkills.length / requiredSkills.length) * 100;
    breakdown.skills = skillsScore;
    weightedScore += skillsScore * 0.4;
    totalWeight += 0.4;
  }

  // 2. Experience Level Match (25% weight)
  if (jobPost.experienceLevel && userProfile.experienceLevel) {
    const experienceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userLevel = experienceLevels.indexOf(userProfile.experienceLevel.toLowerCase());
    const jobLevel = experienceLevels.indexOf(jobPost.experienceLevel.toLowerCase());
    
    if (userLevel >= jobLevel) {
      breakdown.experience = 100;
      weightedScore += 100 * 0.25;
    } else {
      const diff = jobLevel - userLevel;
      const score = Math.max(0, 100 - (diff * 25));
      breakdown.experience = score;
      weightedScore += score * 0.25;
    }
    totalWeight += 0.25;
  }

  // 3. Interests Match (20% weight)
  if (jobPost.interests && userProfile.interests) {
    const userInterests = userProfile.interests.map((i) => i.toLowerCase());
    const jobInterests = jobPost.interests.map((i) => i.toLowerCase());
    const matchedInterests = jobInterests.filter((interest) =>
      userInterests.some((userInterest) => userInterest.includes(interest) || interest.includes(userInterest))
    );
    const interestsScore = jobInterests.length > 0 
      ? (matchedInterests.length / jobInterests.length) * 100 
      : 50; // Default 50% if no interests specified
    breakdown.interests = interestsScore;
    weightedScore += interestsScore * 0.2;
    totalWeight += 0.2;
  }

  // 4. Education Match (10% weight)
  if (jobPost.educationRequired && userProfile.education) {
    const educationLevels = ['high-school', 'bachelor', 'master', 'phd'];
    const userEdu = educationLevels.indexOf(userProfile.education.toLowerCase());
    const jobEdu = educationLevels.indexOf(jobPost.educationRequired.toLowerCase());
    
    if (userEdu >= jobEdu) {
      breakdown.education = 100;
      weightedScore += 100 * 0.1;
    } else {
      breakdown.education = Math.max(0, 100 - ((jobEdu - userEdu) * 30));
      weightedScore += breakdown.education * 0.1;
    }
    totalWeight += 0.1;
  }

  // 5. Location Match (5% weight)
  if (jobPost.location && userProfile.location) {
    const locationMatch = 
      jobPost.location.toLowerCase() === userProfile.location.toLowerCase() ||
      jobPost.location.toLowerCase().includes('remote') ||
      userProfile.location.toLowerCase().includes('remote');
    
    breakdown.location = locationMatch ? 100 : 50;
    weightedScore += breakdown.location * 0.05;
    totalWeight += 0.05;
  }

  // Calculate final score
  const finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;

  // Determine match level
  let matchLevel = 'Low';
  if (finalScore >= 80) matchLevel = 'Excellent';
  else if (finalScore >= 65) matchLevel = 'Good';
  else if (finalScore >= 50) matchLevel = 'Fair';
  else if (finalScore >= 35) matchLevel = 'Poor';

  return {
    score: finalScore,
    breakdown,
    matchLevel,
    recommendation: finalScore >= 70 ? 'Highly Recommended' : finalScore >= 50 ? 'Consider Applying' : 'May Not Be Ideal',
  };
};

/**
 * Calculate match scores for multiple jobs
 * @param {Object} userProfile - User's profile
 * @param {Array} jobs - Array of job postings
 * @returns {Array} Array of jobs with match scores, sorted by score
 */
export const calculateMatchScoresForJobs = (userProfile, jobs) => {
  return jobs
    .map((job) => ({
      ...job,
      matchScore: calculateMatchScore(userProfile, job),
    }))
    .sort((a, b) => b.matchScore.score - a.matchScore.score);
};

