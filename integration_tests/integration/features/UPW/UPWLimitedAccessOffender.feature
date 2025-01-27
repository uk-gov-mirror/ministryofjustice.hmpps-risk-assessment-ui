Feature: Limited access offender check

  As a Probation Practitioner
  I want to know when I do not have permission
  So I don't mistake it for a generic server error

  Scenario: The user is presented an error page when they do not have permission to access the CRN (D000403)
    Given I login and navigate to UPW Start Page with CRN "D000403"
    Then I am presented with the subheading "You do not have permission"
