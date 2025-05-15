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
    Then I check that "No, I’ll come back later" is selected for "Mark cultural or religious adjustments section as complete?"
    And I answer the questions on the page
      | Question                                                    | Type  | Answer | Details              |
      | Are adjustments required for cultural or religious reasons? | Radio | Yes    | Test Culture details |
    And I select "Yes" for the question "Mark cultural or religious adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    Then I select "Yes" for the question "Mark cultural or religious adjustments section as complete?"
    And I click on the "Save" button
    Then I see the following Cultural or religious Summary and Field error messages
      | Question Name                      | Summary Error Messages                                                       | Field Error Messages                                                         |
      | Cultural or religious adjustments? | Are adjustments required for cultural or religious reasons? Select yes or no | Are adjustments required for cultural or religious reasons? Select yes or no |
    And I answer the questions on the page
      | Question                                                    | Type  | Answer | Details |
      | Are adjustments required for cultural or religious reasons? | Radio | Yes    |         |
    And I click on the "Save" button
    Then I see the following Cultural or religious Details Summary and Field error messages
      | Question Name                                     | Summary Error Messages                                                      | Field Error Messages                                                        |
      | Cultural or religious adjustments? - Give details | Enter details of the adjustments required for cultural or religious reasons | Enter details of the adjustments required for cultural or religious reasons |

  Scenario: Verify that all the Cultural or religious values are cleared when the user navigates to Task List Page and back to Cultural or religious page
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I answer the questions on the page
      | Question                                                    | Type  | Answer | Details |
      | Are adjustments required for cultural or religious reasons? | Radio | Yes    |         |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "Incomplete"
    And I click on the "Cultural and religious adjustments" link
    Then I see the following questions on the page are cleared down
      | Question                                                    | Type  |
      | Are adjustments required for cultural or religious reasons? | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I answer the questions on the page
      | Question                                                    | Type  | Answer | Details              |
      | Are adjustments required for cultural or religious reasons? | Radio | Yes    | Test Culture details |
    And I select "No, I’ll come back later" for the question "Mark cultural or religious adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "Incomplete"
    And I click on the "Cultural and religious adjustments" link
    And I check that "Yes" is selected for "Are adjustments required for cultural or religious reasons?"

  Scenario: Verify that the user can mark Cultural or religious details as "Completed" and can change to "Incomplete"
    When I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I answer the questions on the page
      | Question                                                    | Type  | Answer | Details              |
      | Are adjustments required for cultural or religious reasons? | Radio | Yes    | Test Culture details |
    And I select "Yes" for the question "Mark cultural or religious adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "Completed"
    And I see the UPW "task-list" page
    And I click on the "Cultural and religious adjustments" link
    And I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I select "No, I’ll come back later" for the question "Mark cultural or religious adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Cultural and religious adjustments" link is marked as "Incomplete"
