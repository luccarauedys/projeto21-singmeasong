import { prisma } from '../../src/database.js';

export function validData() {
  return {
    name: 'Twenty One Pilots - Chlorine',
    youtubeLink: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek',
  };
}

export function invalidData() {
  return {
    name: 0,
    youtubeLink: '0',
  };
}

export async function createRecommendationAndGetId() {
  const recommendation = validData();
  const result = await prisma.recommendation.create({ data: recommendation });
  return result.id;
}

// export async function getRecommendations() {
//   const recommendations = await prisma.recommendation.findMany();
//   return recommendations;
// }
