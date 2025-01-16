Feature: Verify the Placement Preferences page

  As a Probation Practitioner
  I can enter Placement preferences associated to the Service User
  So that I can consider any adjustments needed on their work placement

  Background: Navigate to "Placement Preferences" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I complete "Gender information" Section with gender as "Female"
    And I see the UPW "task-list" page
    And I click on the "Placement preferences" link

  Scenario Outline: Verify that the user can select the placement preferences and and mark the section as completed
    When I see UPW "Does the individual have any placement preferences?" page
    And I verify that "No, I'll come back later" is Default state on Placement preferences page
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "<Placement Preference Type>"
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Placement preferences" link is marked as "COMPLETED"
    Examples:
      | Placement Preference Type |
      | Individual                |
      | Mixed group               |
      | Female only group         |

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Does the individual have any placement preferences?" page
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    Then I see the following Placement preferences Summary and Field error messages
      | Question Name                                       | Summary Error Messages | Field Error Messages |
      | Does the individual have any placement preferences? | Select yes or no       | Select yes or no     |
    And I select the "Yes" radio Button for placement preferences
    And I click on the "Save" button
    Then I see the following Placement preferences Details Summary and Field error messages
      | Question Name                                     | Summary Error Messages | Field Error Messages |
      | Placement preferences adjustments? - Give details | Select an option       | Select an option     |

  Scenario: Verify that all the Placement preferences related values are cleared when the user navigates to Task List Page and back to Placement preferences page
    When I see UPW "Does the individual have any placement preferences?" page
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "Individual"
    And I click on back link
    Then I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "INCOMPLETE"
    And I click on the "Placement preferences" link
    And I verify that the placement preferences related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Does the individual have any placement preferences?" page
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    Then I see the following Placement preferences Summary and Field error messages
      | Question Name                                       | Summary Error Messages | Field Error Messages |
      | Does the individual have any placement preferences? | Select yes or no       | Select yes or no     |
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "Individual"
    And I select "No, I'll come back later" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "INCOMPLETE"
    And I click on the "Placement preferences" link
    And I verify that the placement preferences related radio button is still selected
    And I verify that the "Individual" Check Box is still selected

  Scenario: Verify that the user can mark placement preferences as "Completed" and can change to "Incomplete"
    When I see UPW "Does the individual have any placement preferences?" page
    Then I verify that "No, I'll come back later" is Default state on Placement preferences page
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "Mixed group"
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "COMPLETED"
    And I see the UPW "task-list" page
    And I click on the "Placement preferences" link
    And I see UPW "Does the individual have any placement preferences?" page
    And I select "No, I'll come back later" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "INCOMPLETE"
