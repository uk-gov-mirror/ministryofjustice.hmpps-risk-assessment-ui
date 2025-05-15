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
    And I check that "No, I’ll come back later" is selected for "Mark placement preferences as complete?"
    And I select "Yes" for the question "Does the individual have any placement preferences?"
    And I say my placement preference is "<Placement Preference Type>"
    And I select "Yes" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Placement preferences" link is marked as "Completed"

    Examples:
      | Placement Preference Type |
      | Individual                |
      | Mixed group               |
      | Female only group         |

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Does the individual have any placement preferences?" page
    And I select "Yes" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    Then I see the following Placement preferences Summary and Field error messages
      | Question Name                                       | Summary Error Messages | Field Error Messages |
      | Does the individual have any placement preferences? | Select yes or no       | Select yes or no     |
    And I select "Yes" for the question "Does the individual have any placement preferences?"
    And I click on the "Save" button
    Then I see the following Placement preferences Details Summary and Field error messages
      | Question Name                                     | Summary Error Messages | Field Error Messages |
      | Placement preferences adjustments? - Give details | Select an option       | Select an option     |

  Scenario: Verify that all the Placement preferences related values are cleared when the user navigates to Task List Page and back to Placement preferences page
    When I see UPW "Does the individual have any placement preferences?" page
    And I select "Yes" for the question "Does the individual have any placement preferences?"
    And I say my placement preference is "Individual"
    And I click on back link
    Then I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "Incomplete"
    And I click on the "Placement preferences" link
    Then I see the following questions on the page are cleared down
      | Question                                            | Type  |
      | Does the individual have any placement preferences? | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Does the individual have any placement preferences?" page
    And I select "Yes" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    Then I see the following Placement preferences Summary and Field error messages
      | Question Name                                       | Summary Error Messages | Field Error Messages |
      | Does the individual have any placement preferences? | Select yes or no       | Select yes or no     |
    And I select "Yes" for the question "Does the individual have any placement preferences?"
    And I say my placement preference is "Individual"
    And I select "No, I’ll come back later" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "Incomplete"
    And I click on the "Placement preferences" link
    And I verify that the placement preferences related radio button is still selected
    And I verify that the "Individual" Check Box is still selected

  Scenario: Verify that the user can mark placement preferences as "Completed" and can change to "Incomplete"
    When I see UPW "Does the individual have any placement preferences?" page
    And I check that "No, I’ll come back later" is selected for "Mark placement preferences as complete?"
    And I select "Yes" for the question "Does the individual have any placement preferences?"
    And I say my placement preference is "Mixed group"
    And I select "Yes" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "Completed"
    And I see the UPW "task-list" page
    And I click on the "Placement preferences" link
    And I see UPW "Does the individual have any placement preferences?" page
    And I select "No, I’ll come back later" for the question "Mark placement preferences as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Placement preferences" link is marked as "Incomplete"
