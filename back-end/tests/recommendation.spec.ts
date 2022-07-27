import supertest from 'supertest';

import app from '../src/app.js';

import { prisma } from '../src/database.js';

import {
  validData,
  invalidData,
  createRecommendationAndGetId,
  createRecommendations,
} from './factories/recommendationFactory.js';

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

describe('POST /recommendations/:id/upvote', () => {
  it('should return a status 400 when id is NaN', async () => {
    const URL = '/recommendations/undefined/upvote';
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(400);
  });

  it('should return a status 404 when recommendation does not exist', async () => {
    const URL = '/recommendations/0/upvote';
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(404);
  });

  it('should return a status 200 when operation is successful', async () => {
    const id = await createRecommendationAndGetId();
    const URL = `/recommendations/${id}/upvote`;
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(200);
  });
});

describe('POST /recommendations/:id/downvote', () => {
  it('should return a status 400 when id is NaN', async () => {
    const URL = '/recommendations/undefined/downvote';
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(400);
  });

  it('should return a status 404 when recommendation does not exist', async () => {
    const URL = '/recommendations/0/downvote';
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(404);
  });

  it('should return a status 200 when operation is successful', async () => {
    const id = await createRecommendationAndGetId();
    const URL = `/recommendations/${id}/downvote`;
    const { statusCode } = await agent.post(URL);
    expect(statusCode).toEqual(200);
  });
});

describe('GET /recommendations', () => {
  it('should return a status 200 when operation is successful', async () => {
    const { statusCode } = await agent.get('/recommendations');
    expect(statusCode).toEqual(200);
  });
});

describe('GET /recommendations/:id', () => {
  it('should return a status 400 when id is NaN', async () => {
    const URL = '/recommendations/undefined';
    const { statusCode } = await agent.get(URL);
    expect(statusCode).toEqual(400);
  });

  it('should return a status 404 when recommendation does not exist', async () => {
    const URL = '/recommendations/0';
    const { statusCode } = await agent.get(URL);
    expect(statusCode).toEqual(404);
  });

  it('should return an object with properties id, name, youtubeLink and score when recommendation exists', async () => {
    const id = await createRecommendationAndGetId();
    const URL = `/recommendations/${id}`;

    const { statusCode, body } = await agent.get(URL);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('youtubeLink');
    expect(body).toHaveProperty('score');
  });
});

describe('GET /recommendations/random', () => {
  it('should return a status 404 when there are no songs registered', async () => {
    const URL = '/recommendations/random';
    const { statusCode } = await agent.get(URL);
    expect(statusCode).toEqual(404);
  });

  it('should return an object with properties id, name, youtubeLink and score when recommendation exists', async () => {
    await createRecommendations();

    const URL = '/recommendations/random';
    const { statusCode, body } = await agent.get(URL);

    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('youtubeLink');
    expect(body).toHaveProperty('score');
  });
});

// describe('GET /recommendations/top/:amount', () => {});

afterAll(async () => {
  await prisma.$disconnect();
});
