import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { getRecommendations, validData } from '../factories/recommendationFactory.js';

describe('recommendationService test suite', () => {
  const recommendationData = getRecommendations()[0];
  const createRecommendationData = validData();

  describe('insert', () => {
    it('should throw a conflict error when recommendation already exists', async () => {
      jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(recommendationData);

      await expect(recommendationService.insert(recommendationData)).rejects.toEqual({
        message: 'Recommendations names must be unique',
        type: 'conflict',
      });
    });

    it('should create a recommendation when it is unique', async () => {
      jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(undefined);

      const fnCreate = jest
        .spyOn(recommendationRepository, 'create')
        .mockResolvedValueOnce(undefined);

      await recommendationService.insert(createRecommendationData);

      expect(fnCreate).toHaveBeenCalledWith(createRecommendationData);
    });
  });

  describe('upvote', () => {
    it('should throw a not found error when recommendation does not exist', async () => {
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

      await expect(recommendationService.upvote(recommendationData.id)).rejects.toEqual({
        message: '',
        type: 'not_found',
      });
    });

    it('should upvote when recommendation exists', async () => {
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendationData);

      const fnUpdate = jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockResolvedValueOnce(undefined);

      await recommendationService.upvote(recommendationData.id);

      expect(fnUpdate).toHaveBeenCalledWith(recommendationData.id, 'increment');
    });
  });

  describe('downvote', () => {
    it('should throw a not found error when recommendation does not exist', async () => {
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

      await expect(recommendationService.upvote(recommendationData.id)).rejects.toEqual({
        message: '',
        type: 'not_found',
      });
    });

    it('should downvote when recommendation exists', async () => {
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendationData);

      const fnUpdate = jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockResolvedValueOnce(recommendationData);

      await recommendationService.downvote(recommendationData.id);

      expect(fnUpdate).toHaveBeenCalledWith(recommendationData.id, 'decrement');
    });

    it('should remove a recommendation when score is less than -5', async () => {
      const recommendationToRemove = { ...recommendationData, score: -6 };

      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendationToRemove);

      jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockResolvedValueOnce(recommendationToRemove);

      const fnRemove = jest
        .spyOn(recommendationRepository, 'remove')
        .mockResolvedValueOnce(undefined);

      await recommendationService.downvote(recommendationData.id);

      expect(fnRemove).toHaveBeenCalledWith(recommendationData.id);
    });
  });

  describe('get', () => {
    it('should get all recommendations', async () => {
      const fnFindAll = jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce(undefined);

      await recommendationService.get();

      expect(fnFindAll).toBeCalled();
    });
  });

  describe('getTop', () => {
    it('should get top ${amount} recommendations', async () => {
      const amount = 5;

      const fnGetAmountByScore = jest
        .spyOn(recommendationRepository, 'getAmountByScore')
        .mockResolvedValueOnce(undefined);

      await recommendationService.getTop(amount);

      expect(fnGetAmountByScore).toHaveBeenCalledWith(amount);
    });
  });

  describe('getRandom', () => {
    it('should throw a not found error when there are no recommendations', async () => {
      const fnFindAll = jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

      expect(fnFindAll).toBeCalled();

      await expect(recommendationService.getRandom()).rejects.toEqual({
        message: '',
        type: 'not_found',
      });
    });

    it('should return a random recommendation', async () => {
      const recommendations = getRecommendations();

      const fnFindAll = jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce(recommendations);

      const result = await recommendationService.getRandom();

      expect(fnFindAll).toBeCalled();
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('youtubeLink');
      expect(result).toHaveProperty('score');
    });
  });
});
