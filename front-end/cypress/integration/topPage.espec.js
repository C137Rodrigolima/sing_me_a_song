/// <reference types="cypress" />

describe("Top Page", ()=>{
  it("Should return musics by top", ()=>{
    cy.visit("http://localhost:3000/top");

    cy.intercept("GET", "http://localhost:5000/recommendations/top/10").as("getTopRecommendation");
    cy.wait("@getTopRecommendation");
  })
})