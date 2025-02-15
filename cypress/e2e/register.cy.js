describe("Registration", () => {
  beforeEach(() => {
    cy.visit("/register");

    Cypress.on("uncaught:exception", (err, runnable) => {
      // Prevent failing tests on unhandled exceptions like Axios errors
      return false;
    });
  });

  it("should display the registration form", () => {
    cy.get("h2").contains("Register").should("be.visible");
    cy.get('input[placeholder="Name"]').should("be.visible");
    cy.get('input[placeholder="Surname"]').should("be.visible");
    cy.get('input[placeholder="Username"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get(".ant-picker").should("be.visible");
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('textarea[placeholder="About Me"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Register").should("be.visible");
  });

  it("should show error for invalid email", () => {
    cy.get('input[placeholder="Email"]').type("invalid-email");
    cy.get('button[type="submit"]').click();
    cy.get(".ant-form-item-explain-error").contains(
      "The input is not valid E-mail!"
    );
  });

  it("should show error for short password", () => {
    cy.get('input[placeholder="Password"]').type("short");
    cy.get('button[type="submit"]').click();
    cy.get(".ant-form-item-explain-error").contains(
      "Password must be at least 6 characters long!"
    );
  });

  it("should show error for existing username", () => {
    cy.intercept("POST", "**/auth/register", {
      statusCode: 409,
      body: "User with such username already exist",
    }).as("registerConflict");

    cy.get('input[placeholder="Name"]').type("Jane");
    cy.get('input[placeholder="Surname"]').type("Doe");
    cy.get('input[placeholder="Username"]').type("danik"); // Existing username
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get(".ant-picker-input").click();
    cy.get(".ant-picker-cell-inner").contains("15").click();
    cy.get('input[placeholder="Email"]').type("jane@example.com");
    cy.get('textarea[placeholder="About Me"]').type("I am Jane Doe");

    cy.get('button[type="submit"]').click();

    cy.wait("@registerConflict");
    cy.get(".ant-notification-notice-error")
      .should("be.visible")
      .contains("User with such username already exist");
  });

  it("should successfully register a user", () => {
    cy.intercept("POST", "**/auth/register", { statusCode: 201 }).as(
      "register"
    );

    cy.get('input[placeholder="Name"]').type("John");
    cy.get('input[placeholder="Surname"]').type("Doe");
    cy.get('input[placeholder="Username"]').type("johndoe");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get(".ant-picker-input").click();
    cy.get(".ant-picker-cell-inner").contains("15").click();
    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('textarea[placeholder="About Me"]').type("I am John Doe");

    cy.get('button[type="submit"]').click();

    cy.wait("@register");
    cy.get(".ant-message-success")
      .should("be.visible")
      .and("contain", "Registration successful!");
    cy.url().should("include", "/login");
  });

  it("should navigate to login page", () => {
    cy.visit("/login");
  });
});
