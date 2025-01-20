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
    And I verify that "No, I'll come back later" is Default state on Equipment page
    And I select the Options and enter the details on the "Equipment" page as follows
      | Question Name                       | Select Option |
      | Male or female clothing required?   | Male          |
      | Waterproof clothing                 | Large         |
      | Footwear                            | Size 10       |
    And I select "Yes" for Mark this section as complete? for Equipment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Choose equipment sizes" page
    And I select "Yes" for Mark this section as complete? for Equipment
    And I click on the "Save" button
    Then I see the following Equipment Summary and Field error messages for "Questions"
      | Question Name                     | Summary Error Messages  | Field Error Messages  |
      | Male or female clothing required? | Select an option        | Select an option      |
      | Waterproof clothing               | Select an option        | Select an option      |
      | Footwear                          | Select an option        | Select an option      |

  # ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page
  Scenario: Verify that all the previously selected Equipment values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Choose equipment sizes" page
    And I select the Options and enter the details on the "Equipment" page as follows
      | Question Name                       | Select Option |
      | Male or female clothing required?   | Male          |
      | Waterproof clothing                 | Medium        |
      | Footwear                            | Size 8        |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Choose equipment sizes" link is marked as "Incomplete"
    And I click on the "Choose equipment sizes" link
    Then I verify that the Equipment related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected values are saved
    When I see UPW "Choose equipment sizes" page
    And I select the Options and enter the details on the "Equipment" page as follows
      | Question Name                       | Select Option |
      | Male or female clothing required?   | Male          |
      | Waterproof clothing                 | X-Small       |
      | Footwear                            | Size 9        |
    And I select "No, I'll come back later" for Mark this section as complete? for Equipment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Incomplete"
    And I click on the "Choose equipment sizes" link
    Then I verify that the Equipment related radio buttons are still selected & unselected
      | Question Name                       | Select Option |
      | Male or female clothing required?   | Male          |
      | Waterproof clothing                 | X-Small       |
      | Footwear                            | Size 9        |

