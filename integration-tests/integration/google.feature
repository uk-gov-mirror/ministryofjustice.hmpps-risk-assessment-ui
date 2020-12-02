Feature: Testing gherkin

  I want to navigate to my service

  Scenario: Opening the first page
    Given I visit path "/start"
    Then I see "Risk Assessment" in the title


  Scenario: Viewing an assessment
    Given I am on the start page
    When I click on the "Continue" link
    Then I see the assessments page
    And there are 3 assessments available

