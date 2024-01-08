describe("Issue comments creating, editing and deleting", () => {
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
    cy
      .get('[data-testid="modal:issue-details"]', { timeout: 60000 })
      .should("be.visible");
  const comment = "TEST_COMMENT";
  const editedComment = "TEST_COMMENT_EDITED";

  it("Should add a comment,edit and delete it successfully", () => {
    getIssueDetailsModal().within(() => {
      //Should create a comment successfully
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      //Assert that added comment is visible
      cy.get('[data-testid="issue-comment"]')
        .contains(comment)
        .should("be.visible");
      cy.get('[data-testid="issue-comment"]').should("have.length", 2);
    });

    //Should edit a comment successfully
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", comment)
        .clear()
        .type(editedComment);

      cy.contains("button", "Save").click().should("not.exist");
      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", editedComment);

      // Assert that the edited comment is visible
      cy.get('[data-testid="issue-comment"]')
        .contains(editedComment)
        .should("be.visible");
    });

    //Should delete a comment successfully
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Are you sure you want to delete this comment?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good.").should("be.visible");
      cy.contains("Delete comment").click();
    });

    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    getIssueDetailsModal().contains(editedComment).should("not.exist");

    //Assert that comment is deleted
    cy.get('[data-testid="issue-comment"]').should("have.length", 1);
  });
});
