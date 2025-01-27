Feature: Verify the offender details on the UPW Start Page

  As a Probation Practitioner
  I will hit a ‘Start assessment’ landing page if I have passed LAO authentication
  So that I can start an UPW assessment

#  CRN with No PNC Scenario - Verify its omitted i.e. not displayed including the heading in the UPW Banner
  Scenario: Verify the details of the offender and the offence on the UPW Start & page start an assessment
    Given I login and navigate to UPW Start Page with CRN "X371443"
    When I see the "Complete and download the Community payback assessment" page
    And I verify the offender does not have a PNC number
    And I verify the following values on the Start Page
      | Offenders Details | Values to be verified |
      | Name              | Billy Bobby           |
      | CRN Number        | X371443               |
      | Date Of Birth     | 19 October 2000       |
      | Offence Code      | 056 - Arson           |
      | Subcode           | 00 - Arson            |
      | Sentence Date     | 7th January 2021      |
    And I click on the Start button
    And I see the UPW "task-list" page

#  With PNC Scenario - Verify it is being displayed on the UPW Banner correctly
  Scenario: Verify the details of the offender and the offence on the UPW Start page for a CRN with PNC
    Given I login and navigate to UPW Start Page with CRN "X065732"
    When I see the "Complete and download the Community payback assessment" page
    And I verify the following values on the Start Page
      | Offenders Details | Values to be verified |
      | Name              | Sam Whitfield         |
      | CRN Number        | X065732               |
      | PNC               | 2008/7231544v         |
      | Date Of Birth     | 02 September 1949     |
      | Offence Code      | 056 - Arson           |
      | Subcode           | 00 - Arson            |
      | Sentence Date     | 7th January 2021      |
    And I click on the Start button
    And I see the UPW "task-list" page

#  CRN with No Sentence Date - Verify its omitted i.e. not displayed but the field is displayed
  Scenario: Verify the details about the offender and the offence on the UPW Start page for a CRN with No Sentence date
    Given I login and navigate to UPW Start Page with CRN "X463280"
    When I see the "Community payback assessment" page
    And I verify the following values on the Start Page
      | Offenders Details | Values to be verified |
      | Name              | Billy Bobby           |
      | CRN Number        | X463280               |
      | PNC               | 2009/0170801P         |
      | Date Of Birth     | 19 October 2000       |
      | Offence Code      | -                     |
      | Subcode           | -                     |
      | Sentence Date     |                       |
    And I click on the Start button
    And I see the UPW "task-list" page
