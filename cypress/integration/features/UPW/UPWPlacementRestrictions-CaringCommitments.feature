Feature: Verify the Caring commitments page

  As a Probation Practitioner
  I can edit details relating to my Service Users caring commitments
  So that I can assess their UPW suitability

  Background: Navigate to "Caring commitments" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Caring commitments" link

  Scenario: Verify that the user can select and answers on the "Caring commitments" Page and mark the section as completed
    When I see UPW "Are there carer commitments?" page
    And I see that "No, I'll come back later" is Default state on Caring commitments page
    And I enter Additional information as "Additional caring commitments" for Caring commitments
    And I select "Yes" for Mark this section as complete? for Caring commitments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Caring commitments" link is marked as "COMPLETED"

#   ARN-742 UPW Task list pages - Caring commitments - Clicking on "Back" Link is not clearing the values on the Caring commitments Page
  Scenario: Verify that all the Caring commitments related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Are there carer commitments?" page
    And I enter Additional information as "Additional caring commitments" for Caring commitments
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Caring commitments" link is marked as "INCOMPLETE"
    And I click on the "Caring commitments" link
    And I see UPW "Are there carer commitments?" page
    Then I verify that the Optional Additional information text box is "Cleared"

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Are there carer commitments?" page
    And I enter Additional information as "Additional caring commitments" for Caring commitments
    And I select "No, I'll come back later" for Mark this section as complete? for Caring commitments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Caring commitments" link is marked as "INCOMPLETE"
    And I click on the "Caring commitments" link
    Then I verify that the Optional Additional information text box is "Not cleared"

