Feature: Verify the GP details page
  As a Probation Practitioner
  I can view details about my Service Users GP
  So I can reference this is my UPW assessment

  Background: Navigate to "Risk of harm in the community" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "GP Details" link

  Scenario: Verify that the user can edit the GP details and mark the section as completed
    When I see UPW "GP Details" page
    And I check that "No, I’ll come back later" is selected for "Mark GP details section as complete?"
    And I click on the "Add GP" button
    And I see UPW "Details of GP" page
    And I answer the questions on the page
      | Question         | Type | Answer                     |
      | Name (Optional)  | Text | Charles Doctor             |
      | GP practice name | Text | Sheffield Medical practice |
      | Building name    | Text | New Offender Building      |
      | House number     | Text |                          1 |
      | Street name      | Text | MAIN Offender's Street     |
      | District         | Text | Sheffield                  |
      | Town or city     | Text | Sheffield                  |
      | County           | Text | South Yorkshire            |
      | Postcode         | Text | S3 1HY                     |
      | Phone number     | Text |                02142785462 |
    And I click on the "Save" button
    And I see UPW "GP Details" page
    And I verify the GP contact details "1" on the GP details page as follows
      | Field Name    | Text to be Verified        |
      | Name          | Charles Doctor             |
      | Practice name | Sheffield Medical practice |
      | Address       | New Offender Building      |
      | Address       |   1 MAIN Offender's Street |
      | Address       | Sheffield                  |
      | Address       | Sheffield                  |
      | Address       | South Yorkshire            |
      | Address       | S3 1HY                     |
      | Phone number  |                02142785462 |
    And I select "Yes" for the question "Mark GP details section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "GP Details" link is marked as "Completed"

  Scenario: Verify that user can complete GP details section by not adding GP details
    When I see UPW "GP Details" page
    And I check that "No, I’ll come back later" is selected for "Mark GP details section as complete?"
    And I say Individual declined to give GP details
    And I select "Yes" for the question "Mark GP details section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "GP Details" link is marked as "Completed"

  Scenario: Verify that it is mandatory to provide a set of GP details or check the "Individual declined to give GP details" CheckBox
    When I see UPW "GP Details" page
    And I select "Yes" for the question "Mark GP details section as complete?"
    And I click on the "Save" button
    Then I see the following Summary and Field error messages on GP details page
      | Field Name                                       | Summary Error Message                                                                   | Field Error Message                                                                     |
      | Individual declined to give an emergency contact | You must provide a GP contact or select if the individual has declined to give details. | You must provide a GP contact or select if the individual has declined to give details. |

  Scenario: Verify that the user can leave the GP details section as incomplete
    When I see UPW "GP Details" page
    And I check that "No, I’ll come back later" is selected for "Mark GP details section as complete?"
    And I say Individual declined to give GP details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "GP Details" link is marked as "Incomplete"

  Scenario: Try to continue without entering any text for GP details and verify the error messages
    When I see UPW "GP Details" page
    And I click on the "Add GP" button
    And I see UPW "Details of GP" page
    And I click on the "Save" button
    Then I see the following Summary and Field error messages for GP details
      | Field Name       | Summary Error Messages       | Field Error Messages         |
      | Medical practice | GP practice name is required | GP practice name is required |
      | Phone number     | Phone number is required     | Phone number is required     |
