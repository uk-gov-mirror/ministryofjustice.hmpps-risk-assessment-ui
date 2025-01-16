Feature: Verify the Cultural or religious adjustments page

  As a Probation Practitioner
  I can enter Cultural or religious details associated to the Service User
  So that I can consider any adjustments needed on their work placement

  Background: Navigate to UPW "Cultural or religious adjustments" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Cultural and religious adjustments" link

  Scenario: Verify that the user can enter Cultural or religious de  tails and mark the section as completed
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    Then I verify that "No, I'll come back later" is Default state on Cultural and religious page
    And I select the "Yes" radio Button for culture and religious adjustments
    And I enter details for culture and religious adjustments as "Test Culture details"
    And I select "Yes" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "COMPLETED"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    Then I select "Yes" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    Then I see the following Cultural or religious Summary and Field error messages
      | Question Name                      | Summary Error Messages                                                       | Field Error Messages                                                         |
      | Cultural or religious adjustments? | Are adjustments required for cultural or religious reasons? Select yes or no | Are adjustments required for cultural or religious reasons? Select yes or no |
    And I select the "Yes" radio Button for culture and religious adjustments
    And I click on the "Save" button
    Then I see the following Cultural or religious Details Summary and Field error messages
      | Question Name                                       | Summary Error Messages                                                      | Field Error Messages                                                        |
      | Cultural or religious adjustments? - Give details   | Enter details of the adjustments required for cultural or religious reasons | Enter details of the adjustments required for cultural or religious reasons |

  Scenario: Verify that all the Cultural or religious values are cleared when the user navigates to Task List Page and back to Cultural or religious page
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    Then I select the "Yes" radio Button for culture and religious adjustments
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "INCOMPLETE"
    And I click on the "Cultural and religious adjustments" link
    And I verify that the culture and religious related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I select the "Yes" radio Button for culture and religious adjustments
    And I enter details for culture and religious adjustments as "Test Culture details"
    And I select "No, I'll come back later" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "INCOMPLETE"
    And I click on the "Cultural and religious adjustments" link
    And I verify that the Culture and religious related radio button is still selected

  Scenario: Verify that the user can mark Cultural or religious details as "Completed" and can change to "Incomplete"
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I select the "Yes" radio Button for culture and religious adjustments
    And I enter details for culture and religious adjustments as "Test Culture details"
    And I select "Yes" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "COMPLETED"
    And I see the UPW "task-list" page
    And I click on the "Cultural and religious adjustments" link
    And I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I select "No, I'll come back later" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "INCOMPLETE"
