Feature: Verify the Health issues page
  As a Probation Practitioner
  I can enter health issues information
  So that I can assess my service user's health needs

  Background: Navigate to "Health issues" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Health issues" link

  Scenario: Verify that the user can select and enter answers on the "Health issues" Page and mark the section as completed
    When I see UPW "Are there any other health issues that may affect ability to work?" page
    And I check that "No, I’ll come back later" is selected for "Mark health issues section as complete?"
    And I answer the questions on the page
      | Question                                                     | Type  | Answer   | Details                                               |
      | Does the individual have any known allergies?                | Radio | Yes      | Entering Text related to Allergies                    |
      | Has the individual experienced sudden loss of consciousness? | Radio | Yes      | Entering Text related to Sudden loss of consciousness |
      | Does the individual have epilepsy?                           | Radio | Yes      | Entering Text related to Epilepsy                     |
      | Is the individual pregnant or recently given birth?          | Radio | Pregnant | Entering Text related to Pregnancy                    |
      | Any other health issues?                                     | Radio | Yes      | Entering Text related to Health issues                |
    And I select "Yes" for the question "Mark health issues section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Health issues" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Are there any other health issues that may affect ability to work?" page
    And I select "Yes" for the question "Mark health issues section as complete?"
    And I click on the "Save" button
    Then I see the following Health issues Summary and Field error messages for "Questions"
      | Question Name                                                | Summary Error Messages | Field Error Messages |
      | Does the individual have any known allergies?                | Select yes or no       | Select yes or no     |
      | Has the individual experienced sudden loss of consciousness? | Select yes or no       | Select yes or no     |
      | Does the individual have epilepsy?                           | Select yes or no       | Select yes or no     |
      | Any other health issues?                                     | Select yes or no       | Select yes or no     |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions & without entering details and verify the error messages
    When I see UPW "Are there any other health issues that may affect ability to work?" page
    And I answer the questions on the page
      | Question                                                     | Type  | Answer   |
      | Does the individual have any known allergies?                | Radio | Yes      |
      | Has the individual experienced sudden loss of consciousness? | Radio | Yes      |
      | Does the individual have epilepsy?                           | Radio | Yes      |
      | Is the individual pregnant or recently given birth?          | Radio | Pregnant |
      | Any other health issues?                                     | Radio | Yes      |
    And I select "Yes" for the question "Mark health issues section as complete?"
    And I click on the "Save" button
    Then I see the following Health issues Summary and Field error messages for "Give Details"
      | Give Details for Questions                                   | Summary Error Messages | Field Error Messages |
      | Does the individual have any known allergies?                | Enter details          | Enter details        |
      | Has the individual experienced sudden loss of consciousness? | Enter details          | Enter details        |
      | Does the individual have epilepsy?                           | Enter details          | Enter details        |
      | Is the individual pregnant or recently given birth?          | Enter details          | Enter details        |
      | Any other health issues?                                     | Enter details          | Enter details        |
#   ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page

  Scenario: Verify that all the Health issues related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Are there any other health issues that may affect ability to work?" page
    And I answer the questions on the page
      | Question                                                     | Type  | Answer   | Details                                               |
      | Does the individual have any known allergies?                | Radio | Yes      | Entering Text related to Allergies                    |
      | Has the individual experienced sudden loss of consciousness? | Radio | Yes      | Entering Text related to Sudden loss of consciousness |
      | Does the individual have epilepsy?                           | Radio | Yes      | Entering Text related to Epilepsy                     |
      | Is the individual pregnant or recently given birth?          | Radio | Pregnant | Entering Text related to Pregnancy                    |
      | Any other health issues?                                     | Radio | Yes      | Entering Text related to Health issues                |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Health issues" link is marked as "Incomplete"
    And I click on the "Health issues" link
    Then I see the following questions on the page are cleared down
      | Question                                                     | Type  |
      | Does the individual have any known allergies?                | Radio |
      | Has the individual experienced sudden loss of consciousness? | Radio |
      | Does the individual have epilepsy?                           | Radio |
      | Is the individual pregnant or recently given birth?          | Radio |
      | Any other health issues?                                     | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Are there any other health issues that may affect ability to work?" page
    And I answer the questions on the page
      | Question                                                     | Type  | Answer   | Details                                |
      | Does the individual have any known allergies?                | Radio | Yes      | Entering Text related to Allergies     |
      | Has the individual experienced sudden loss of consciousness? | Radio | No       |                                        |
      | Does the individual have epilepsy?                           | Radio | Yes      | Entering Text related to Epilepsy      |
      | Is the individual pregnant or recently given birth?          | Radio | Pregnant | Entering Text related to Pregnancy     |
      | Any other health issues?                                     | Radio | Yes      | Entering Text related to Health issues |
    And I select "No, I’ll come back later" for the question "Mark health issues section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Health issues" link is marked as "Incomplete"
    And I click on the "Health issues" link
    Then I verify that the Health issues related radio buttons are still selected & unselected
      | Question Name                                                | Select Option |
      | Does the individual have any known allergies?                | Yes           |
      | Has the individual experienced sudden loss of consciousness? | No            |
      | Does the individual have epilepsy?                           | Yes           |
      | Is the individual pregnant or recently given birth?          | Pregnant      |
      | Any other health issues?                                     | Yes           |
