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
    And I see that "No, I'll come back later" is Default state on Intensive working page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I enter the details on the "Intensive working" page as follows
      | Question Name                                                                             | Text to be entered in Details                 |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 0                                             |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "COMPLETED"

  #  NO Option for the Questions
  Scenario: Verify that the user can select NO on the "Intensive working" Page and mark the section as completed
    When I see UPW "Intensive working" page
    And I see that "No, I'll come back later" is Default state on Intensive working page
    And I select "No" for "Is the individual eligible for intensive working?" Intensive working question
    And I enter the details on the "Eligibility No Details" as follows
      | Question Name                                     | Text to be entered in Give Details                          |
      | Is the individual eligible for intensive working? | Entering Text related to not eligible for intensive working |
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "COMPLETED"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Intensive working" page
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    Then I see the following Intensive working Summary and Field error messages
      | Question Name                                                                | Summary Error Messages                                              | Field Error Messages                                               |
      | Does the individual have an education, training or employment-related need?  | Is the individual eligible for intensive working? Select yes or no  | Is the individual eligible for intensive working? Select yes or no |

  Scenario: Try to continue by selecting "Yes" Option for the eligibility Question and without entering details to verify the error messages
    When I see UPW "Intensive working" page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    Then I see the following Intensive working Details Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages                                                                                              | Field Error Messages                                                                                                |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | Enter recommended hours per week in addition to the statutory minimum at the start of the order between 0 and 21    | Enter recommended hours per week in addition to the statutory minimum at the start of the order between 0 and 21    |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | Enter recommended hours per week in addition to the statutory minimum at the midpoint of the order between 0 and 21 | Enter recommended hours per week in addition to the statutory minimum at the midpoint of the order between 0 and 21 |
      | At what point should the individual be expected to reach a 28-hour working week?          | Enter details of when the individual should be expected to reach a 28 hour working week	                            | Enter details of when the individual should be expected to reach a 28 hour working week	                          |

  Scenario: Try to continue by selecting "No" Option for the eligibility Question and without entering details to verify the error messages
    When I see UPW "Intensive working" page
    And I select "No" for "Is the individual eligible for intensive working?" Intensive working question
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    Then I see the following eligibility No Details Summary and Field error messages
      | Question Name                                     | Summary Error Messages                                                       | Field Error Messages                                                         |
      | Is the individual eligible for intensive working? | Enter details about why the individual is not eligible for intensive working | Enter details about why the individual is not eligible for intensive working |

#   ARN-742 UPW Task list pages - Intensive working - Clicking on "Back" Link is not clearing the values on the Intensive working Page
  Scenario: Verify that all the Intensive working related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Intensive working" page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I enter the details on the "Intensive working" page as follows
      | Question Name                                                                             | Text to be entered in Details                 |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 0                                             |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Intensive working" link is marked as "INCOMPLETE"
    And I click on the "Intensive working" link
    Then I verify that the Intensive working related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Intensive working" page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I enter the details on the "Intensive working" page as follows
      | Question Name                                                                             | Text to be entered in Details                 |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 11                                            |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
    And I select "No, I'll come back later" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Intensive working" link is marked as "INCOMPLETE"
    And I click on the "Intensive working" link
    Then I verify that the Intensive working related radio buttons are still selected & unselected
      | Question Name                                                                             | Text to be verified in Details                |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 11                                            |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
