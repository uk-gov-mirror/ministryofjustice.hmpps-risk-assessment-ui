Feature: Verify the Training & employment opportunities page

  As a Probation Practitioner
  I can enter Training & employment opportunities
  So that I can assess my service users Training & employment opportunities needs

  Background: Navigate to "Training & employment opportunities" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Training & employment opportunities" link

  #  YES Option for All the Questions and enter details
  Scenario: Verify that the user can select and eneter answers on the "Training & employment opportunities" Page and mark the section as completed
    When I see UPW "Training & employment opportunities" page
    And I see that "No, I'll come back later" is Default state on Training & employment page
    And I select the Options and enter the details on the "Training & employment" page as follows
      | Question Name                                                                             | Select Option | Text to be entered in Give Details          |
      | Does the individual have an education, training or employment-related need?               | Yes           | Entering Text related to the training needs |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Yes           |                                             |
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Training & employment opportunities" link is marked as "Completed"

  #  NO Option for the Questions
  Scenario: Verify that the user can select NO on the "Training & employment opportunities" Page and mark the section as completed
    When I see UPW "Training & employment opportunities" page
    And I see that "No, I'll come back later" is Default state on Training & employment page
    And I select the Options and enter the details on the "Training & employment" page as follows
      | Question Name                                                                             | Select Option | Text to be entered in Give Details          |
      | Does the individual have an education, training or employment-related need?               | Yes           | Entering Text related to the training needs |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Yes           |                                             |
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Training & employment opportunities" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Training & employment opportunities" page
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    Then I see the following Training & employment Summary and Field error messages
      | Question Name                                                               | Summary Error Messages | Field Error Messages |
      | Does the individual have an education, training or employment-related need? | Select yes or no       | Select yes or no     |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions and without entering details to verify the error messages
    When I see UPW "Training & employment opportunities" page
    And I select "Yes" for "Does the individual have an education, training or employment-related need?" Training need question
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    Then I see the following Training & employment Details Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages | Field Error Messages |
      | Does the individual have an education, training or employment-related need?               | Enter details          | Enter details        |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Select yes or no       | Select yes or no     |
    And I select "No" for "Does the individual agree to use the maximum entitlement of their hours on this activity?" Training need question
    And I click on the "Save" button
    And I see the following Training & Individual Commitment Details Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages | Field Error Messages |
      | Does the individual have an education, training or employment-related need?               | Enter details          | Enter details        |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Enter details          | Enter details        |

#   ARN-742 UPW Task list pages - Training & employment opportunities - Clicking on "Back" Link is not clearing the values on the Training & employment opportunities Page
  Scenario: Verify that all the Training & employment opportunities related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Training & employment opportunities" page
    And I select the Options and enter the details on the "Training & employment" page as follows
      | Question Name                                                                             | Select Option | Text to be entered in Give Details          |
      | Does the individual have an education, training or employment-related need?               | Yes           | Entering Text related to the training needs |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Yes           |                                             |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Training & employment opportunities" link is marked as "Incomplete"
    And I click on the "Training & employment opportunities" link
    Then I verify that the Training & employment related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Training & employment opportunities" page
    And I select the Options and enter the details on the "Training & employment" page as follows
      | Question Name                                                                             | Select Option | Text to be entered in Give Details          |
      | Does the individual have an education, training or employment-related need?               | Yes           | Entering Text related to the training needs |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | Yes           |                                             |
    And I select "No, I'll come back later" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Training & employment opportunities" link is marked as "Incomplete"
    And I click on the "Training & employment opportunities" link
    Then I verify that the Training & employment related radio buttons are still selected & unselected
      | Question Name                                                                             | Select Option |
      | Does the individual have an education, training or employment-related need?               | Yes           |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | No            |
