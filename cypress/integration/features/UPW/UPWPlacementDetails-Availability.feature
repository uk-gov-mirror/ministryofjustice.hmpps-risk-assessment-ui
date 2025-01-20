Feature: Verify the Availability page

  As a Probation Practitioner
  I can de-select the days and slots that my Service User is unavailable for unpaid work
  So that I can record accurate availability

  Background: Navigate to "Availability" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Availability" link

  Scenario: Verify that the user can select and enter answers on the "Availability" Page and mark the section as completed
    When I see UPW "Availability for Community Payback work" page
    And I see that "No, I'll come back later" is Default state on Availability page
    And I verify that all the Availability related Check Boxes are selected
    And I select the Availability CheckBoxes as follows
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I enter "Available early mornings and late nights" in the Additional availability information
    And I select "Yes" for Mark this section as complete? for Availability
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Availability" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Availability for Community Payback work" page
    And I select "Yes" for Mark this section as complete? for Availability
    And I click on the "Save" button
    Then I see the Availability Summary and Field error messages
      | Question Name                              | Summary Error Messages                           | Field Error Messages                             |
      | When is the individual available for work? | Select when the individual is available for work | Select when the individual is available for work |

#   ARN-742 UPW Task list pages - Availability - Clicking on "Back" Link is not clearing the values on the Availability Page
  Scenario: Verify that all the Availability related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Availability for Community Payback work" page
    And I see that "No, I'll come back later" is Default state on Availability page
    And I select the Availability CheckBoxes as follows
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Availability" link is marked as "Incomplete"
    And I click on the "Availability" link
    Then I verify that all the Availability related Check Boxes are selected

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter CheckBoxes are saved
    When I see UPW "Availability" page
    When I see UPW "Availability for Community Payback work" page
    And I see that "No, I'll come back later" is Default state on Availability page
    And I select the Availability CheckBoxes as follows
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I enter "Available early mornings and late nights" in the Additional availability information
    And I select "No, I’ll come back later" for Mark this section as complete? for Availability
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Availability" link is marked as "Incomplete"
    And I click on the "Availability" link
    Then I verify that all the Availability Check Boxes are still selected & deselected as follows
      | Availability | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday |
      | Morning      | Yes    | No      | No        | No       | Yes    | No       | No     |
      | Afternoon    | No     | Yes     | No        | Yes      | No     | Yes      | No     |
      | Evening      | No     | No      | Yes       | No       | No     | No       | Yes    |


