Feature: Verify the Travel information page
  As a Probation Practitioner
  I can enter travel information
  So that I can assess my service users travel needs

  Background: Navigate to "Travel information" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Travel" link

  Scenario: Verify that the user can select and answers on the "Travel information" Page and mark the section as completed
    When I see UPW "Travel information" page
    And I check that "No, I’ll come back later" is selected for "Mark travel information section as complete?"
    And I answer the questions on the page
      | Question                                                                     | Type  | Answer | Details                                    |
      | Does the individual have any travel issues that will affect their placement? | Radio | Yes    | Entering Text related to the Travel Issues |
      | Does the individual have a valid driving licence?                            | Radio | Yes    |                                            |
      | Do they have access to a vehicle?                                            | Radio | Yes    |                                            |
      | Is public transport available and accessible to the individual?              | Radio | Yes    |                                            |
    And I select "Yes" for the question "Mark travel information section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Travel" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Travel information" page
    And I select "Yes" for the question "Mark travel information section as complete?"
    And I click on the "Save" button
    Then I see the following Travel information Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages | Field Error Messages |
      | Do any one of the above affect the individual's ability to engage with Community Payback? | Select yes or no       | Select yes or no     |
    And I select "Yes" for the question "Does the individual have any travel issues that will affect their placement?"
    And I click on the "Save" button
    Then I see the following Travel information Details Summary and Field error messages
      | Question Name                                                                             | Summary Error Messages | Field Error Messages |
      | Do any one of the above affect the individual's ability to engage with Community Payback? | Enter details          | Enter details        |
      | Does the individual have a valid driving licence?                                         | Select yes or no       | Select yes or no     |
      | Do they have access to a vehicle?                                                         | Select yes or no       | Select yes or no     |
      | Is public transport available and accessible to the individual?                           | Select yes or no       | Select yes or no     |
#   ARN-742 UPW Task list pages - Travel information - Clicking on "Back" Link is not clearing the values on the Travel information Page

  Scenario: Verify that all the Travel information related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Travel information" page
    And I answer the questions on the page
      | Question                                                                     | Type  | Answer | Details                                 |
      | Does the individual have any travel issues that will affect their placement? | Radio | Yes    | Entering Text related to the disability |
      | Does the individual have a valid driving licence?                            | Radio | Yes    |                                         |
      | Do they have access to a vehicle?                                            | Radio | Yes    |                                         |
      | Is public transport available and accessible to the individual?              | Radio | Yes    |                                         |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Travel" link is marked as "Incomplete"
    And I click on the "Travel" link
    Then I see the following questions on the page are cleared down
      | Question                                                                     | Type  |
      | Does the individual have any travel issues that will affect their placement? | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Travel information" page
    And I answer the questions on the page
      | Question                                                                     | Type  | Answer | Details                                 |
      | Does the individual have any travel issues that will affect their placement? | Radio | Yes    | Entering Text related to the disability |
      | Does the individual have a valid driving licence?                            | Radio | No     |                                         |
      | Do they have access to a vehicle?                                            | Radio | Yes    |                                         |
      | Is public transport available and accessible to the individual?              | Radio | No     |                                         |
    And I select "No, I’ll come back later" for the question "Mark travel information section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Travel" link is marked as "Incomplete"
    And I click on the "Travel" link
    Then I verify that the Travel information related radio buttons are still selected & unselected
      | Question Name                                                                             | Select Option |
      | Do any one of the above affect the individual's ability to engage with Community Payback? | Yes           |
      | Does the individual have a valid driving licence?                                         | No            |
      | Do they have access to a vehicle?                                                         | Yes           |
      | Is public transport available and accessible to the individual?                           | No            |
