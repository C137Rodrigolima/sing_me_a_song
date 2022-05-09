/// <reference types="cypress" />

describe("Random Page", ()=>{
  it("Should return one music by random", ()=>{
    cy.visit("http://localhost:3000/random");

    cy.intercept("GET", "http://localhost:5000/recommendations/random").as("getRandomRecommendation");
    cy.wait("@getRandomRecommendation");
  })
})