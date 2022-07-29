import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { getRecommendations, validData } from '../factories/recommendationFactory.js';

describe('recommendationService test suite', () => {
  const recommendationData = getRecommendations()[0];
  const createRecommendationData = validData();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('insert', () => {
    it('should throw a conflict error when recommendation already exists', async () => {
      jest
        .spyOn(recommendationRepository, 'findByName')
        .mockResolvedValueOnce(recommendationData);

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
      jest
        .spyOn(recommendationRepository, 'find')
        .mockResolvedValueOnce(recommendationData);

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
      jest
        .spyOn(recommendationRepository, 'find')
        .mockResolvedValueOnce(recommendationData);

      const fnUpdate = jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockResolvedValueOnce(recommendationData);

      await recommendationService.downvote(recommendationData.id);

      expect(fnUpdate).toHaveBeenCalledWith(recommendationData.id, 'decrement');
    });

    it('should remove a recommendation when score is less than -5', async () => {
      const recommendationToRemove = { ...recommendationData, score: -6 };

      jest
        .spyOn(recommendationRepository, 'find')
        .mockResolvedValueOnce(recommendationToRemove);

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

  describe('getById', () => {
    it('should fail when id does not exist', async () => {
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

      await expect(recommendationService.getById(recommendationData.id)).rejects.toEqual({
        message: '',
        type: 'not_found',
      });
    });

    it('should get recommendation when id exists', async () => {
      const fnFind = jest
        .spyOn(recommendationRepository, 'find')
        .mockResolvedValueOnce(recommendationData);

      await recommendationService.getById(recommendationData.id);

      expect(fnFind).toHaveBeenCalledWith(recommendationData.id);
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
      jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

      await expect(recommendationService.getRandom()).rejects.toEqual({
        message: '',
        type: 'not_found',
      });
    });

    it('should call findAll with param "gt" when generated random number < 0.7', async () => {
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.6);

      const fnFindAll = jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce([recommendationData]);

      await recommendationService.getRandom();

      expect(fnFindAll).toHaveBeenCalledWith({ score: 10, scoreFilter: 'gt' });
    });

    it('should call findAll with param "lte" when generated random number >= 0.7', async () => {
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.7);

      const fnFindAll = jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce([recommendationData]);

      await recommendationService.getRandom();

      expect(fnFindAll).toHaveBeenCalledWith({ score: 10, scoreFilter: 'lte' });
    });

    it('should call findAll twice when there are no recommendations that matches score filter', async () => {
      const recommendations = getRecommendations();

      jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
      jest.spyOn(Math, 'floor').mockReturnValueOnce(1);

      const fnFindAll = jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(recommendations);

      await recommendationService.getRandom();

      expect(fnFindAll).toHaveBeenCalledTimes(2);
    });

    it('should return a random recommendation', async () => {
      const recommendations = getRecommendations();

      jest
        .spyOn(recommendationRepository, 'findAll')
        .mockResolvedValueOnce(recommendations);

      jest.spyOn(Math, 'floor').mockReturnValue(3);

      const result = await recommendationService.getRandom();

      expect(result).toEqual(recommendations[3]);
    });
  });
});
