import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { CreateRecommendationData } from '../services/recommendationsService.js';

async function create(createRecommendationData: CreateRecommendationData) {
  await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: 'lte' | 'gt';
}

function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);

  return prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: 'desc' },
    take: 10,
  });
}

function getAmountByScore(take: number) {
  return prisma.recommendation.findMany({
    orderBy: { score: 'desc' },
    take,
  });
}

function getFindAllFilter(findAllWhere?: FindAllWhere): Prisma.RecommendationWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

function find(id: number) {
  return prisma.recommendation.findUnique({
    where: { id },
  });
}

function findByName(name: string) {
  return prisma.recommendation.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: 'increment' | 'decrement') {
  return prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

async function remove(id: number) {
  await prisma.recommendation.delete({
    where: { id },
  });
}

async function removeAll() {
  return await prisma.recommendation.deleteMany();
}

async function createMany() {
  const recommendations = [
    {
      name: 'Twenty One Pilots - Chlorine',
      youtubeLink: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek',
      score: 150,
    },
    {
      name: 'Gotye - Somebody That I Used To Know',
      youtubeLink: 'https://www.youtube.com/watch?v=8UVNT4wvIGY',
      score: 99,
    },
    {
      name: 'Hozier - Take Me To Church',
      youtubeLink: 'https://www.youtube.com/watch?v=PVjiKRfKpPI',
      score: 80,
    },
    {
      name: 'Imagine Dragons - Wrecked',
      youtubeLink: 'https://www.youtube.com/watch?v=Y2NkuFIlLEo',
      score: 120,
    },
    {
      name: 'Twenty One Pilots - Shy Away',
      youtubeLink: 'https://www.youtube.com/watch?v=3sO-Y1Zbft4',
      score: 108,
    },
  ];

  return await prisma.recommendation.createMany({ data: recommendations });
}

export const recommendationRepository = {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
  removeAll,
  createMany,
};
