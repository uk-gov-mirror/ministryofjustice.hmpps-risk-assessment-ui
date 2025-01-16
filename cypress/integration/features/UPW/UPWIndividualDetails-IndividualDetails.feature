Feature: Verify the Individuals details page

  As a Probation Practitioner
  I can review personal, contact and emergency contact details for my service user
  So that I can check that the details we hold on record are correct

  Background: Navigate to "Risk of harm in the community" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Individual's details" link

  Scenario: Verify that the user can edit the contact details and mark the section as completed
    When I see UPW "Individual's details" page
    And I verify that "No, I'll come back later" is Default state on Individuals details page
    And I click "Change" link for changing Contact details
    And I see UPW "Contact details" page
#    And I see "Emergency contact 1" sub heading
    Then I enter the details on the "Contact details" page as follows
      | Field Name      | Text to be entered     |
      | Building name   | New Offender Building  |
      | House number    | 1                      |
      | Street name     | MAIN Offender's Street |
      | District        | Sheffield              |
      | Town/City       | Sheffield              |
      | County          | South Yorkshire        |
      | Postcode        | S3 1HY                 |
      | Phone number    | 02142785462            |
      | Mobile number   | 07123456789            |
      | Email           | test@test.com          |
    And I click the "Save" button on Contact details
    And I see UPW "Individual's details" page
    And I verify the details on the "Individuals details" page as follows
      | Field Name      | Text to be Verified    |
      | Building name   | New Offender Building  |
      | House number    | 1                      |
      | Street name     | MAIN Offender's Street |
      | District        | Sheffield              |
      | Town/City       | Sheffield              |
      | County          | South Yorkshire        |
      | Postcode        | S3 1HY                 |
      | Mobile number   | 07123456789            |
      | Phone number    | 02142785462            |
      | Email           | test@test.com          |
    And I say Individual declined to give an emergency contact
    And I select "Yes" for Mark this section as complete? for Individuals details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Individual's details" link is marked as "COMPLETED"

  Scenario: Try to continue without entering any text for contact details and verify the error messages
    When I see UPW "Individual's details" page
    And I click "Change" link for changing Contact details
    And I see UPW "Contact details" page
    And I click the "Save" button on Contact details
    Then I see the following Summary and Field error messages for Contact details
      | Field Name     | Summary Error Messages                                     | Field Error Messages                                       |
      | Building name  | You must provide details for Building name or House number | You must provide details for Building name or House number |
      | House number   | You must provide details for Building name or House number | You must provide details for Building name or House number |
      | Street name    | Street name is required                                    | Street name is required                                    |
      | Town/City      | Town/City is required                                      | Town/City is required                                      |
      | Postcode       | Postcode is required                                       | Postcode is required                                       |
      | Phone number   | You must provide details for Mobile or Phone number        | You must provide details for Mobile or Phone number        |
      | Mobile number  | You must provide details for Mobile or Phone number        | You must provide details for Mobile or Phone number        |
      | Email          | Email address is required                                  | Email address is required                                  |

  Scenario: Verify that it is mandatory to provide a set of EC details or check the "Individual declined to give an emergency contact" CheckBox
    When I see UPW "Individual's details" page
    And I select "Yes" for Mark this section as complete? for Individuals details
    And I click the "Save" button on Contact details
    Then I see the following Summary and Field error messages on Individual details page
      | Field Name                                       | Summary Error Message                                                                           | Field Error Message                                                                            |
      | Individual declined to give an emergency contact | You must provide an emergency contact or select if the individual has declined to give details. | You must provide an emergency contact or select if the individual has declined to give details.|

  Scenario: Verify that the user can add the Emergency contact details
    When I see UPW "Individual's details" page
    And I click "Add contact" button for Emergency contact details
    And I see UPW "Emergency contact" page
    Then I enter the details on the "Emergency contact details" page as follows
      | Field Name                     | Text to be entered |
      | First name                     | Charles            |
      | Family name                    | Europe             |
      | Relationship to the individual | Friend             |
      | Phone number                   | 02142785462        |
      | Mobile number                  | 020123456789       |
    And I click the "Save" button on Contact details
    And I see UPW "Individual's details" page
    And I verify the Emergency details on the "Individuals details" page as follows
      | Field Name                     | Text to be Verified |
      | Name                           | Charles             |
      | Surname                        | Europe              |
      | Relationship to the individual | Friend              |
      | Mobile number                  | 020123456789        |
      | Phone number                   | 02142785462         |
    And I select "Yes" for Mark this section as complete? for Individuals details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Individual's details" link is marked as "COMPLETED"

  Scenario: Try to continue without entering any text for Emergency contact details and verify the error messages - "Emergency contact" page
    When I see UPW "Individual's details" page
    And I click "Add contact" button for Emergency contact details
    And I see UPW "Emergency contact" page
    And I click the "Save" button on Contact details
    Then I see the following Summary and Field error messages for Emergency contact details
      | Field Name                      | Summary Error Messages                     | Field Error Messages                       |
      | First name                      | Name is required                           | Name is required                           |
      | Family name                     | Surname is required                        | Surname is required                        |
      | Relationship to the individual  | Emergency contact relationship is required | Emergency contact relationship is required |
      | Phone number                    | A phone number is required                 | A phone number is required                 |
      | Mobile number                   | A mobile is required                       | A mobile is required                       |
