import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export default async function createFactory(body : CreateRecommendationData) {
  await prisma.recommendation.create({
    data: body
  })
  const recommendation = await prisma.recommendation.findFirst({});
  return recommendation;
}