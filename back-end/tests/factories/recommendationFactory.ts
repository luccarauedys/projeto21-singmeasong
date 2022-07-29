import prisma from '../../src/config/database.js';

export function validData() {
  return {
    name: 'Twenty One Pilots - Shy Away',
    youtubeLink: 'https://www.youtube.com/watch?v=3sO-Y1Zbft4',
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

export async function createRecommendations() {
  const recommendations = [
    {
      name: 'Twenty One Pilots - Chlorine',
      youtubeLink: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek',
    },
    {
      name: 'Gotye - Somebody That I Used To Know',
      youtubeLink: 'https://www.youtube.com/watch?v=8UVNT4wvIGY',
    },
    {
      name: 'Hozier - Take Me To Church',
      youtubeLink: 'https://www.youtube.com/watch?v=PVjiKRfKpPI',
    },
    {
      name: 'Imagine Dragons - Wrecked',
      youtubeLink: 'https://www.youtube.com/watch?v=Y2NkuFIlLEo',
    },
  ];

  await prisma.recommendation.createMany({
    data: recommendations,
  });

  return recommendations;
}

export function getRecommendations() {
  return [
    {
      id: 1,
      name: 'Twenty One Pilots - Chlorine',
      youtubeLink: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek',
      score: 20,
    },
    {
      id: 2,
      name: 'Gotye - Somebody That I Used To Know',
      youtubeLink: 'https://www.youtube.com/watch?v=8UVNT4wvIGY',
      score: 8,
    },
    {
      id: 3,
      name: 'Hozier - Take Me To Church',
      youtubeLink: 'https://www.youtube.com/watch?v=PVjiKRfKpPI',
      score: 5,
    },
    {
      id: 4,
      name: 'Imagine Dragons - Wrecked',
      youtubeLink: 'https://www.youtube.com/watch?v=Y2NkuFIlLEo',
      score: 10,
    },
    {
      id: 5,
      name: 'Twenty One Pilots - Shy Away',
      youtubeLink: 'https://www.youtube.com/watch?v=3sO-Y1Zbft4',
      score: 14,
    },
  ];
}
