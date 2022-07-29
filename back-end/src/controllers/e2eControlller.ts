import { Request, Response } from 'express';
import { recommendationRepository } from '../repositories/recommendationRepository.js';

export async function resetDatabase(_req: Request, res: Response) {
  await recommendationRepository.removeAll();
  res.sendStatus(200);
}

export async function seedDatabase(_req: Request, res: Response) {
  await recommendationRepository.createMany();
  res.sendStatus(200);
}
