Feature: Verify the Intensive working page
  As a Probation Practitioner
  I can enter Intensive working details related to my Service User
  So that I can assess their suitability for Intensive working

  Background: Navigate to "Intensive working" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Intensive working" link
  #  YES Option for All the Questions and enter details

  Scenario: Verify that the user can select and enter answers on the "Intensive working" Page and mark the section as completed
    When I see UPW "Intensive working" page
    And I check that "No, I’ll come back later" is selected for "Mark intensive working section as complete?"
    And I answer the questions on the page
      | Question                                                                                  | Type  | Answer                                        |
      | Is the individual eligible for intensive working?                                         | Radio | Yes                                           |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | Text  |                                            21 |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | Text  |                                             0 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Text  | Entering Text related to 28-hour working week |
    And I select "Yes" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "Completed"
  #  NO Option for the Questions

  Scenario: Verify that the user can select NO on the "Intensive working" Page and mark the section as completed
    When I see UPW "Intensive working" page
    And I check that "No, I’ll come back later" is selected for "Mark intensive working section as complete?"
    And I answer the questions on the page
      | Question                                          | Type  | Answer | Details                                                     |
      | Is the individual eligible for intensive working? | Radio | No     | Entering Text related to not eligible for intensive working |
    And I select "Yes" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Intensive working" page
    And I select "Yes" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    Then I see the following Intensive working Summary and Field error messages
      | Question Name                                                               | Summary Error Messages                                             | Field Error Messages                                               |
      | Does the individual have an education, training or employment-related need? | Is the individual eligible for intensive working? Select yes or no | Is the individual eligible for intensive working? Select yes or no |

  Scenario: Try to continue by selecting "Yes" Option for the eligibility Question and without entering details to verify the error messages
    When I see UPW "Intensive working" page
    And I select "Yes" for the question "Is the individual eligible for intensive working?"
    And I select "Yes" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    Then I see the following Intensive working Details Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages                                                                                              | Field Error Messages                                                                                                |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | Enter recommended hours per week in addition to the statutory minimum at the start of the order between 0 and 21    | Enter recommended hours per week in addition to the statutory minimum at the start of the order between 0 and 21    |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | Enter recommended hours per week in addition to the statutory minimum at the midpoint of the order between 0 and 21 | Enter recommended hours per week in addition to the statutory minimum at the midpoint of the order between 0 and 21 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Enter details of when the individual should be expected to reach a 28 hour working week                             | Enter details of when the individual should be expected to reach a 28 hour working week                             |

  Scenario: Try to continue by selecting "No" Option for the eligibility Question and without entering details to verify the error messages
    When I see UPW "Intensive working" page
    And I select "No" for the question "Is the individual eligible for intensive working?"
    And I select "Yes" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    Then I see the following eligibility No Details Summary and Field error messages
      | Question Name                                     | Summary Error Messages                                                       | Field Error Messages                                                         |
      | Is the individual eligible for intensive working? | Enter details about why the individual is not eligible for intensive working | Enter details about why the individual is not eligible for intensive working |
#   ARN-742 UPW Task list pages - Intensive working - Clicking on "Back" Link is not clearing the values on the Intensive working Page

  Scenario: Verify that all the Intensive working related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Intensive working" page
    And I answer the questions on the page
      | Question                                                                                  | Type  | Answer                                        |
      | Is the individual eligible for intensive working?                                         | Radio | Yes                                           |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | Text  |                                            21 |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | Text  |                                             0 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Text  | Entering Text related to 28-hour working week |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Intensive working" link is marked as "Incomplete"
    And I click on the "Intensive working" link
    Then I see the following questions on the page are cleared down
      | Question                                                                                  | Type  |
      | Is the individual eligible for intensive working?                                         | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Intensive working" page
    And I answer the questions on the page
      | Question                                                                                  | Type  | Answer                                        |
      | Is the individual eligible for intensive working?                                         | Radio | Yes                                           |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | Text  |                                            21 |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | Text  |                                            11 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Text  | Entering Text related to 28-hour working week |
    And I select "No, I’ll come back later" for the question "Mark intensive working section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Intensive working" link is marked as "Incomplete"
    And I click on the "Intensive working" link
    Then I verify that the Intensive working related radio buttons are still selected & unselected
      | Question Name                                                                             | Text to be verified in Details                |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    |                                            21 |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order |                                            11 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
