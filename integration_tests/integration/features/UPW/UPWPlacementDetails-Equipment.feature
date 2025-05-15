Feature: Verify the Equipment page
  As a Probation Practitioner
  I can enter details about my Service Users gender and clothing sizes
  So that I can order them suitable waterproof clothing to wear whilst undertaking their unpaid work

  Background: Navigate to "Equipment" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Choose equipment sizes" link

  Scenario: Verify that the user can select and answers on the "Equipment" Page and mark the section as completed
    When I see UPW "Choose equipment sizes" page
    And I see "Choose equipment sizes" in page title
    And I check that "No, I’ll come back later" is selected for "Mark equipment sizes section as complete?"
    And I answer the questions on the page
      | Question                          | Type     | Answer  |
      | Male or female clothing required? | Radio    | Male    |
      | Waterproof clothing               | Radio    | Large   |
      | Footwear                          | Dropdown | Size 10 |
    And I select "Yes" for the question "Mark equipment sizes section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Choose equipment sizes" page
    And I select "Yes" for the question "Mark equipment sizes section as complete?"
    And I click on the "Save" button
    Then I see the following Equipment Summary and Field error messages for "Questions"
      | Question Name                     | Summary Error Messages | Field Error Messages |
      | Male or female clothing required? | Select an option       | Select an option     |
      | Waterproof clothing               | Select an option       | Select an option     |
      | Footwear                          | Select an option       | Select an option     |
  # ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page

  Scenario: Verify that all the previously selected Equipment values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Choose equipment sizes" page
    And I answer the questions on the page
      | Question                          | Type     | Answer |
      | Male or female clothing required? | Radio    | Male   |
      | Waterproof clothing               | Radio    | Medium |
      | Footwear                          | Dropdown | Size 8 |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Choose equipment sizes" link is marked as "Incomplete"
    And I click on the "Choose equipment sizes" link
    Then I see the following questions on the page are cleared down
      | Question                          | Type     |
      | Male or female clothing required? | Radio    |
      | Waterproof clothing               | Radio    |
      | Footwear                          | Dropdown |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected values are saved
    When I see UPW "Choose equipment sizes" page
    And I answer the questions on the page
      | Question                          | Type     | Answer  |
      | Male or female clothing required? | Radio    | Male    |
      | Waterproof clothing               | Radio    | X-Small |
      | Footwear                          | Dropdown | Size 9  |
    And I select "No, I’ll come back later" for the question "Mark equipment sizes section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Incomplete"
    And I click on the "Choose equipment sizes" link
    Then I verify that the Equipment related radio buttons are still selected & unselected
      | Question Name                     | Select Option |
      | Male or female clothing required? | Male          |
      | Waterproof clothing               | X-Small       |
      | Footwear                          | Size 9        |
