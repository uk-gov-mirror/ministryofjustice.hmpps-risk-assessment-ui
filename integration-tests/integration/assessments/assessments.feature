Feature: View assessments

  I want to see a list of available assessments

  Background:
    Given I am on the start page
    And I click on the "Continue" link
    Then I see the assessments page

  Scenario: Viewing an assessment
    Given there are 3 assessments available
    When I select assessment 2
    Then I see the "Long Form" assessment page

