/// <reference types="cypress" />
import {faker} from "@faker-js/faker";

describe("Home Page", ()=>{
  it("Should add a music", ()=>{
    const music = {
      name: faker.lorem.words(2),
      youtubeLink: "https://www.youtube.com/watch?v=hdRuPqjPNxM"
    }

    cy.visit("http://localhost:3000/");

    cy.intercept("GET", "http://localhost:5000/recommendations").as("getAllRecommendation");
    cy.wait("@getAllRecommendation");


    cy.get("#name").type(music.name);
    cy.get("#youtubeLink").type(music.youtubeLink);

    cy.intercept("POST", "http://localhost:5000/recommendations").as("CreateRecommendation");

    cy.get("#createButton").click();
    cy.wait("@CreateRecommendation");

    cy.intercept("GET", "http://localhost:5000/recommendations").as("getAllRecommendation");
    cy.wait("@getAllRecommendation");
  })
  
});