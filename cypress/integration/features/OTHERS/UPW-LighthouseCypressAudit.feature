Feature: Verify the Cultural or religious adjustments page

  As a Probation Practitioner
  I can verify Cultural or religious details performance metrics using lighthouse
  So that I know the front end performance metrics are under thresholds

  Scenario: Verify that the user can enter Cultural or religious details and mark the section as completed
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And user checks for performance metrics using lighthouse

