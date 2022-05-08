import { faker } from "@faker-js/faker";
import { not } from "joi";
import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import bodyFactory from "../factories/bodyFactory.js"
import createFactory from "../factories/createFactory.js";

describe("Recommendations Integration Tests", () => {
  describe("POST /recommendations/", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return 201 given a valid body", async () => {
      const body = bodyFactory();

      const response = await supertest(app).post("/recommendations/").send(body);
      const result = await prisma.recommendation.findUnique({
        where: {
          name: body.name
        }
      });
      
      expect(response.status).toEqual(201);
      expect(result).not.toBeNull();
    });
  });
  describe("POST /recommendations/:id/upvote", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return 200 given a valid id", async () => {
      const body = bodyFactory();
      const recommendation = await createFactory(body);
      
      const response = await supertest(app)
      .post(`/recommendations/${recommendation.id}/upvote`);
      const result = await prisma.recommendation.findUnique({
        where: {
          id: recommendation.id
        }
      })
      
      expect(response.status).toEqual(200);
      expect(result.score).toEqual(recommendation.score + 1);
    });
  });
  describe("POST /recommendations/:id/downvote", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return 200 given a valid id", async () => {
      const body = bodyFactory();
      const recommendation = await createFactory(body);
      
      const response = await supertest(app)
      .post(`/recommendations/${recommendation.id}/downvote`);
      const result = await prisma.recommendation.findUnique({
        where: {
          id: recommendation.id
        }
      })
      
      expect(response.status).toEqual(200);
      expect(result.score).toEqual(recommendation.score - 1);
    });
    it("should delete by id where score downvotes higher than 5", async () => {
      const body = bodyFactory();
      const recommendation = await createFactory(body);

      await prisma.recommendation.update({
        where: {
          id: recommendation.id
        },
        data: {
          score: { decrement: 5 }, 
        }
      })
      
      const response = await supertest(app)
      .post(`/recommendations/${recommendation.id}/downvote`);
      const result = await prisma.recommendation.findUnique({
        where: {
          id: recommendation.id
        }
      })
      
      expect(response.status).toEqual(200);
      expect(result).toBeNull();
    });
  });

  describe("GET /recommendations/", () => {
    it("should return 200 on route", async () => {
      const response = await supertest(app)
      .get("/recommendations/");
      
      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();
      expect(response.body.length).toEqual(0);
    });
  });

  describe("GET /recommendations/:id", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return recommendation by id", async () => {
      const body = bodyFactory();
      const recommendation = await createFactory(body);
      
      const response = await supertest(app)
      .get(`/recommendations/${recommendation.id}`);
      
      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();
    });
  });

  describe("GET /recommendations/random", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return 1 random recommendation", async () => {
      const body = bodyFactory();
      await createFactory(body);
      
      const response = await supertest(app)
      .get("/recommendations/random");
      
      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();
    });
  });

  describe("GET /recommendations/top/:amount", () => {
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });

    it("should return 1 random recommendation", async () => {
      const body = bodyFactory();
      await createFactory(body);
      const amount = 10;
      
      const response = await supertest(app)
      .get(`/recommendations/top/${amount}`);
      
      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();
      expect(response.body.length).toBeLessThanOrEqual(amount);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
