describe('Todo Application', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should add and remove a task with TODO status, checking estimation summary visibility', () => {
    cy.contains('Open Add Task Form').click();
    cy.get('input[name="title"]').should('be.visible');

    cy.get('input[name="title"]').type('New Task');
    cy.get('input[name="estimate"]').type('5');
    cy.get('#assigneeId')
      .parent()
      .click()
      .get('ul > li[data-value="40e6c495000000000000000000000000"]')
      .click();
    cy.get('#status')
      .parent()
      .click()
      .get('ul > li[data-value="TODO"]')
      .click();
    cy.contains('Add Task').click();

    cy.contains('New Task').should('be.visible');

    cy.contains('Estimation Summary').should('be.visible');

    cy.get('.tasks-list')
      .first()
      .contains('New Task')
      .parent()
      .find('button')
      .get('#delete')
      .click({ force: true });

    cy.contains('New Task').should('not.exist');

    cy.contains('Estimation Summary').should('not.exist');
  });

  it('should add and remove a task with DONE status, checking estimation summary invisibility', () => {
    cy.contains('Open Add Task Form').click();
    cy.get('input[name="title"]').should('be.visible');

    cy.get('input[name="title"]').type('Completed Task');
    cy.get('input[name="estimate"]').type('3');
    cy.get('#assigneeId')
      .parent()
      .click()
      .get('ul > li[data-value="40e6c495000000000000000000000000"]')
      .click();
    cy.get('#status')
      .parent()
      .click()
      .get('ul > li[data-value="DONE"]')
      .click();
    cy.contains('Add Task').click();

    cy.contains('Completed Task').should('be.visible');

    cy.contains('Estimation Summary').should('not.exist');

    cy.get('.tasks-list')
      .contains('Completed Task')
      .parent()
      .find('button')
      .get('#delete')
      .click({ force: true });

    cy.contains('Completed Task').should('not.exist');

    cy.contains('Estimation Summary').should('not.exist');
  });

  it('should display and hide toast when adding a task with high estimate', () => {
    cy.contains('Open Add Task Form').click();
    cy.get('input[name="title"]').should('be.visible');

    cy.get('input[name="title"]').type('High Estimate Task');
    cy.get('input[name="estimate"]').type('100000');
    cy.get('#assigneeId')
      .parent()
      .click()
      .get('ul > li[data-value="40e6c495000000000000000000000000"]')
      .click();
    cy.get('#status')
      .parent()
      .click()
      .get('ul > li[data-value="TODO"]')
      .click();
    cy.contains('Add Task').click();

    cy.contains('Error:').should('be.visible');

    cy.wait(5000);
    cy.contains('Error:').should('not.exist');
  });
});
