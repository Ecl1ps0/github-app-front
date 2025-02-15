describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");

    Cypress.on("uncaught:exception", (err, runnable) => {
      // Prevent failing tests on unhandled exceptions like Axios errors
      return false;
    });
  });

  it("displays the login form", () => {
    cy.get("form").should("be.visible");
    cy.get('input[placeholder="Username"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("contain", "Log in");
  });

  it("shows error for empty form submission", () => {
    cy.get('button[type="submit"]').click();
    cy.get(".ant-form-item-explain-error").should("be.visible");
  });

  it("shows error notification for invalid credentials", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: "Invalid credentials",
    }).as("loginFailed");

    cy.get('input[placeholder="Username"]').type("invaliduser");
    cy.get('input[placeholder="Password"]').type("invalidpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginFailed");

    cy.get(".ant-notification-notice-error")
      .should("be.visible")
      .contains("Invalid credentials");
  });

  it("successfully logs in with valid credentials", () => {
    const validUsername = "danik";
    const validPassword = "superpass";

    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: { access_token: "mocked.jwt.token" },
    }).as("loginRequest");

    cy.get('input[placeholder="Username"]').type(validUsername);
    cy.get('input[placeholder="Password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest")
      .its("response.body.access_token")
      .should("exist")
      .and("not.be.empty");

    cy.window()
      .its("localStorage.access_token")
      .should("eq", "mocked.jwt.token");

    cy.visit("/");
  });

  it("navigates to register page", () => {
    cy.contains("register now!").click();
    cy.url().should("include", "/register");
  });
});
