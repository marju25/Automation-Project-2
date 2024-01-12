describe("AUTOMATION TESTS FOR TIME TRACKING FUNCTIONALITY", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getIssueTimeTrackingModal = () =>
    cy.get('[data-testid="modal:tracking"]');
  const estimatedTime = "10";
  const editedEstimatedTime = "20";
  const timeSpent = "Time spent (hours)";
  const timeRemaining = "Time remaining (hours)";
  const loggedTime = "2";
  const remainingTime = "5";
  const editedLoggedTime = "3";
  const editedRemainingTime = "6";
  const stopwatch = '[data-testid="icon:stopwatch"]';

  it("Should add estimation time, edit that time and remove the estimation finally", () => {
    // Add estimation time
    getIssueDetailsModal().within(() => {
      cy.contains("Original Estimate (hours)");
      cy.get('input[placeholder="Number"]').clear().type(estimatedTime);
      cy.contains("div", "10h estimated").should("be.visible");
    });

    // Edit estimation time
    getIssueDetailsModal().within(() => {
      cy.contains("Original Estimate (hours)");
      cy.get('input[placeholder="Number"]').clear().type(editedEstimatedTime);
      cy.contains("div", "20h estimated").should("be.visible");
    });

    // Delete estimation time
    getIssueDetailsModal().within(() => {
      cy.contains("Original Estimate (hours)");
      cy.get('input[placeholder="Number"]').clear();
      cy.contains("div", "20h estimated").should("not.exist");
    });
  });

  it("Should add spent time and remaining time, after editing it delete that time ", () => {
    // Add spent and remainig time
    cy.get(stopwatch).click();
    getIssueTimeTrackingModal().within(() => {
      cy.contains(timeSpent);
      cy.get('input[placeholder="Number"][value="4"]').clear().type(loggedTime);
      cy.contains(timeRemaining);
      cy.get('input[placeholder="Number"][value=""]').type(remainingTime);
      cy.contains("button", "Done").click();
    });

    // Assert that spent and remaining time are visible
    cy.contains("div", "2h logged").should("be.visible");
    cy.contains("div", "5h remaining").should("be.visible");

    // Edit spent and remaining time
    cy.get(stopwatch).click();
    getIssueTimeTrackingModal().within(() => {
      cy.contains(timeSpent);
      cy.get('input[placeholder="Number"][value="2"]')
        .clear()
        .type(editedLoggedTime);
      cy.contains(timeRemaining);
      cy.get('input[placeholder="Number"][value="5"]')
        .clear()
        .type(editedRemainingTime);
      cy.contains("button", "Done").click();
    });

    // Assert that spent and remaining time are visible
    cy.contains("div", "3h logged").should("be.visible");
    cy.contains("div", "6h remaining").should("be.visible");

    // Delete spent and remainig time
    cy.get(stopwatch).click();
    getIssueTimeTrackingModal().within(() => {
      cy.contains(timeSpent);
      cy.get('input[placeholder="Number"][value="3"]').clear();
      cy.contains(timeRemaining);
      cy.get('input[placeholder="Number"][value="6"]').clear();
      cy.contains("button", "Done").click();
    });

    // Assert that the time value is removed
    getIssueDetailsModal().within(() => {
      cy.contains("div", "No time logged").should("be.visible");
      cy.contains("div", "6h remaining").should("not.exist");
      cy.contains("div", "8h estimated").should("be.visible");
    });
  });
});
