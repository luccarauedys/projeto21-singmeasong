import supertest from 'supertest';
import app from '../src/app.js';
import { validData, invalidData } from './factories/recommendationFactory.js';
import { prisma } from '../src/database.js';

const agent = supertest(app);

beforeEach(async () => {
  await prisma.recommendation.deleteMany();
});

describe('POST /recommendations', () => {
  it('should return a status 422 when invalid data is provided', async () => {
    const recommendation = invalidData();
    const { statusCode } = await agent.post('/recommendations').send(recommendation);
    expect(statusCode).toEqual(422);
  });

  it('should return a status 409 when recommendation already exists', async () => {
    const recommendation = validData();
    await agent.post('/recommendations').send(recommendation);
    const { statusCode } = await agent.post('/recommendations').send(recommendation);
    expect(statusCode).toEqual(409);
  });

  it('should return a status 201 when recommendation is created', async () => {
    const recommendation = validData();
    const { statusCode } = await agent.post('/recommendations').send(recommendation);
    expect(statusCode).toEqual(201);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
