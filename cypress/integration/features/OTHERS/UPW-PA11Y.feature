Feature: Verify the Cultural or religious adjustments page

  As a Probation Practitioner
  I can verify the accessibility audit using pa11y

  Scenario: Verify that the user can enter Cultural or religious details and mark the section as completed
    Given I login and navigate to UPW Task list page with dataDriven CRN by injecting Axe
    And I see the UPW "task-list" page
    And user checks for accessibility audit using pa11y
