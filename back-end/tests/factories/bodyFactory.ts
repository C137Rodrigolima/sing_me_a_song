import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default function bodyFactory() : CreateRecommendationData {
  return {
    name: faker.lorem.word(3),
    youtubeLink: "https://www.youtube.com/watch?v=4VxdufqB9zg",
  }
}