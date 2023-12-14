describe('Delete an issue', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue=true');
      cy.contains('This is an issue of type: Task.').click();
    });
  });


  it('Should delete issue successfully', () => {
    //Delete the issue and confirming it
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Are you sure you want to delete this issue?').should('be.visible');
      cy.contains("Once you delete, it's gone for good").should('be.visible');
      cy.contains('Delete issue').click();
    })

    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    //Assert that the issue is deleted and no longer displayed on the Jira board (3 issues)
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains('This is an issue of type: Task.').should('not.exist');
      cy.get('[data-testid="list-issue"]').should('have.length', 3);


    });
  })

  it('Should cancel delete issue process successfully', () => {
    //Cancel the deletion and confirming the action
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Are you sure you want to delete this issue?').should('be.visible');
      cy.contains("Once you delete, it's gone for good").should('be.visible');
      cy.contains('Cancel').click();
    })

    // Assert that the cancelation confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');

    //Assert that the issue is still displayed on the Jira board (4 issues)
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains('This is an issue of type: Task.').should('be.visible');
      cy.get('[data-testid="list-issue"]').should('have.length', 4);

    });
  })
})