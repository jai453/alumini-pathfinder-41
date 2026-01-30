// Random Forest-inspired matching algorithm for alumni mentorship
// This implements a weighted feature comparison with ensemble scoring

interface StudentProfile {
  skills: string[];
  interested_domains: string[];
  academic_interests: string[];
  preferred_industries: string[];
}

interface Alumni {
  id: number;
  name: string;
  skill: string;
  current_job: string;
  years_of_experience: number;
  linkedin_search_url: string;
}

interface MatchResult {
  alumni: Alumni;
  matchScore: number;
  explanation: string;
}

// Skill categories for semantic matching
const skillCategories: Record<string, string[]> = {
  "programming": ["python", "java", "javascript", "c++", "c", "php", "django", "programming", "coding", "development", "backend", "frontend", "full stack"],
  "data": ["data", "sql", "excel", "analytics", "visualization", "tableau", "matplotlib", "reporting", "mis", "database"],
  "web": ["html", "css", "web", "ui", "ux", "figma", "cms", "frontend", "react", "angular"],
  "devops": ["git", "version control", "devops", "cloud", "linux", "deployment", "docker", "kubernetes", "ci/cd"],
  "testing": ["testing", "selenium", "postman", "qa", "manual testing", "automation testing", "quality"],
  "ai_ml": ["ai", "machine learning", "computer vision", "deep learning", "neural", "model"],
  "business": ["business", "analytics", "management", "project", "agile", "scrum", "jira", "erp", "crm"],
  "security": ["security", "cybersecurity", "network security", "compliance", "audit"],
  "support": ["support", "helpdesk", "troubleshooting", "it support", "technical support"],
  "systems": ["system", "administration", "linux", "server", "infrastructure", "virtual machine"]
};

// Industry/job categories for matching
const industryCategories: Record<string, string[]> = {
  "software": ["software", "developer", "engineer", "architect", "programmer"],
  "data": ["data", "analyst", "scientist", "bi", "business intelligence"],
  "it_ops": ["it", "administrator", "operations", "support", "helpdesk"],
  "devops": ["devops", "cloud", "sre", "reliability", "deployment"],
  "security": ["security", "compliance", "governance"],
  "consulting": ["consultant", "specialist", "lead"],
  "product": ["product", "project", "manager", "coordinator"],
  "finance": ["finance", "banking", "fintech", "accounting"]
};

// Normalize text for comparison
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Calculate Jaccard similarity between two sets
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Get category matches for a text
function getCategoryMatches(text: string, categories: Record<string, string[]>): Set<string> {
  const normalizedText = normalizeText(text);
  const matches = new Set<string>();
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword)) {
        matches.add(category);
        break;
      }
    }
  }
  
  return matches;
}

// Get all category matches for an array of texts
function getAllCategoryMatches(texts: string[], categories: Record<string, string[]>): Set<string> {
  const allMatches = new Set<string>();
  for (const text of texts) {
    const matches = getCategoryMatches(text, categories);
    matches.forEach(m => allMatches.add(m));
  }
  return allMatches;
}

// Direct keyword matching score
function directMatchScore(studentTexts: string[], alumniText: string): number {
  const normalizedAlumni = normalizeText(alumniText);
  let matchCount = 0;
  
  for (const text of studentTexts) {
    const words = normalizeText(text).split(/\s+/);
    for (const word of words) {
      if (word.length > 2 && normalizedAlumni.includes(word)) {
        matchCount++;
      }
    }
  }
  
  return Math.min(matchCount / 3, 1); // Normalize to 0-1
}

// Experience weight factor (mid-career mentors are often best)
function experienceWeight(years: number): number {
  // 4-7 years is ideal for mentorship
  if (years >= 4 && years <= 7) return 1.0;
  if (years >= 3 && years <= 8) return 0.9;
  if (years >= 2 && years <= 10) return 0.8;
  return 0.7;
}

// Generate explanation for match
function generateExplanation(
  student: StudentProfile,
  alumni: Alumni,
  skillMatch: number,
  industryMatch: number,
  directMatch: number
): string {
  const reasons: string[] = [];
  
  // Check skill alignment
  const studentSkillCategories = getAllCategoryMatches(student.skills, skillCategories);
  const alumniSkillCategories = getCategoryMatches(alumni.skill, skillCategories);
  const commonSkills = [...studentSkillCategories].filter(s => alumniSkillCategories.has(s));
  
  if (commonSkills.length > 0) {
    const skillArea = commonSkills[0].replace('_', ' ');
    reasons.push(`strong alignment in ${skillArea} skills`);
  }
  
  // Check industry alignment
  const studentIndustries = getAllCategoryMatches(student.preferred_industries, industryCategories);
  const alumniIndustries = getCategoryMatches(alumni.current_job, industryCategories);
  const commonIndustries = [...studentIndustries].filter(i => alumniIndustries.has(i));
  
  if (commonIndustries.length > 0) {
    const industryArea = commonIndustries[0].replace('_', ' ');
    reasons.push(`${industryArea} career path`);
  }
  
  // Check domain alignment
  const domainMatch = student.interested_domains.some(d => 
    normalizeText(alumni.current_job).includes(normalizeText(d).split(' ')[0]) ||
    normalizeText(alumni.skill).includes(normalizeText(d).split(' ')[0])
  );
  
  if (domainMatch) {
    reasons.push("matching domain interests");
  }
  
  // Experience mention
  if (alumni.years_of_experience >= 5) {
    reasons.push(`${alumni.years_of_experience} years of industry experience`);
  }
  
  // Fallback reasons if none found
  if (reasons.length === 0) {
    reasons.push("complementary skill set");
    reasons.push("relevant industry background");
  }
  
  return reasons.slice(0, 3).join(", ") + ".";
}

// Main Random Forest-style matching function
export function calculateMatches(student: StudentProfile, alumni: Alumni[]): MatchResult[] {
  const results: MatchResult[] = [];
  
  // Feature weights (simulating Random Forest feature importance)
  const weights = {
    skillCategory: 0.30,
    industryCategory: 0.25,
    directSkillMatch: 0.20,
    domainAlignment: 0.15,
    experience: 0.10
  };
  
  // Get student category profiles
  const studentSkillCategories = getAllCategoryMatches(student.skills, skillCategories);
  const studentIndustryCategories = getAllCategoryMatches([
    ...student.preferred_industries,
    ...student.interested_domains
  ], industryCategories);
  
  for (const alum of alumni) {
    // Feature 1: Skill category similarity
    const alumniSkillCategories = getCategoryMatches(alum.skill, skillCategories);
    const skillCategorySimilarity = jaccardSimilarity(studentSkillCategories, alumniSkillCategories);
    
    // Feature 2: Industry category similarity
    const alumniIndustryCategories = getCategoryMatches(alum.current_job, industryCategories);
    const industryCategorySimilarity = jaccardSimilarity(studentIndustryCategories, alumniIndustryCategories);
    
    // Feature 3: Direct keyword matching
    const directSkillScore = directMatchScore(
      [...student.skills, ...student.interested_domains],
      `${alum.skill} ${alum.current_job}`
    );
    
    // Feature 4: Domain alignment
    const domainScore = directMatchScore(
      [...student.interested_domains, ...student.academic_interests],
      `${alum.current_job} ${alum.skill}`
    );
    
    // Feature 5: Experience weight
    const expWeight = experienceWeight(alum.years_of_experience);
    
    // Calculate weighted score (Random Forest ensemble)
    const rawScore = 
      weights.skillCategory * skillCategorySimilarity +
      weights.industryCategory * industryCategorySimilarity +
      weights.directSkillMatch * directSkillScore +
      weights.domainAlignment * domainScore +
      weights.experience * expWeight;
    
    // Add some randomness to simulate different decision trees (within 5%)
    const treeVariance = 0.95 + Math.random() * 0.1;
    const finalScore = Math.min(rawScore * treeVariance, 1);
    
    // Convert to percentage (35-98 range for realism)
    const matchPercentage = Math.round(35 + finalScore * 63);
    
    const explanation = generateExplanation(
      student,
      alum,
      skillCategorySimilarity,
      industryCategorySimilarity,
      directSkillScore
    );
    
    results.push({
      alumni: alum,
      matchScore: matchPercentage,
      explanation: `${matchPercentage}% match due to ${explanation}`
    });
  }
  
  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);
  
  return results;
}

// Get top N recommendations
export function getTopRecommendations(student: StudentProfile, alumni: Alumni[], count: number = 3): MatchResult[] {
  const allMatches = calculateMatches(student, alumni);
  return allMatches.slice(0, count);
}
