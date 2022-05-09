import { jest } from "@jest/globals";
import { Recommendation } from "@prisma/client";
import { number, string } from "joi";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";

describe("Recommendation Service Unit Tests", ()=>{

  describe("POST /recomendation/", ()=>{
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("Should trow an Conflict Error given a duplicated name", async ()=>{
      const body: CreateRecommendationData = {
        name: "title duplicated",
        youtubeLink: "https://www.youtube.com/watch?v=4VxdufqB9zg",
      }

      jest.spyOn(recommendationRepository, "findByName")
      .mockResolvedValue({
        id: 1,
        score: 1,
        ...body
      });

      expect(recommendationService.insert(body)).rejects.toEqual(
        conflictError("Recommendations names must be unique")
      )
    })
  });

  describe("GET /recommendation/:id", ()=>{
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("Should throow a Not Found Error given a invalid id", async ()=>{
      const id = 1;

      jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

      expect(recommendationService.getById(id)).rejects.toEqual(
        notFoundError("Recommendation not found")
      )
    })
  });

  describe("GET /recommendation/random", ()=>{
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    const body = [
        {
          id: 1,
          name: "Chitãozinho - Evidências",
          youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
          score: 245
        },
        {
          id: 1,
          name: "Xororó - Evidências",
          youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
          score: 245
        }
      ];

    it("Should return Not found Error if there's no recommendations", async ()=>{

      jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

      expect(recommendationService.getRandom).rejects.toEqual(
        notFoundError("Recommendation not found")
      );
    });

    it("Should return a case of sucess to 70% random math", async ()=>{

      jest.spyOn(global.Math, 'random').mockReturnValue(0.7);
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(body);

      expect(recommendationService.getRandom).toMatchObject;
    });
    
    it("Should return a case of sucess to < 70% random math", async ()=>{

      jest.spyOn(global.Math, 'random').mockReturnValue(0.2);
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(body);

      expect(recommendationService.getRandom).toMatchObject;
    });
  });

})