/// <reference types="cypress" />

describe("Top Page", ()=>{
  it("Should return mone music by random", ()=>{
    cy.visit("http://localhost:3000/top");

    cy.intercept("GET", "http://localhost:5000/recommendations/random").as("getRandomRecommendation");
    cy.wait("@getRandomRecommendation");
  })
})