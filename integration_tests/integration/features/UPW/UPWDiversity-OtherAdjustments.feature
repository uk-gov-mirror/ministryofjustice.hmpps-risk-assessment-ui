Feature: Verify the Other Adjustments page
  As a Probation Practitioner
  I can enter information associated to the Service User
  So that I can consider any adjustments needed on their work placement

  Background: Navigate to UPW "Other Adjustments" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Other adjustments" link

  Scenario: Verify that the user can enter other adjustments and mark the section as completed
    When I see UPW "Other adjustments" page
    Then I check that "No, I’ll come back later" is selected for "Mark the other adjustments section as complete?"
    And I answer the questions on the page
      | Question            | Type      | Answer                         |
      | Trauma              | Text Area | Details of trauma              |
      | Gender              | Text Area | Details of gender              |
      | Neurodiversity      | Text Area | Details of neurodiversity      |
      | Transport/Mobility  | Text Area | Details of transport/mobility  |
      | Maturity Assessment | Text Area | Details of maturity assessment |
      | Maturity            | Text Area | Details of maturity            |
    And I select "Yes" for the question "Mark the other adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Other adjustments" link is marked as "Completed"

  Scenario: Verify that all the values are cleared when the user navigates to task list page and back to "Other Adjustments" page
    When I see UPW "Other adjustments" page
    And I answer the questions on the page
      | Question            | Type      | Answer                         |
      | Trauma              | Text Area | Details of trauma              |
      | Gender              | Text Area | Details of gender              |
      | Neurodiversity      | Text Area | Details of neurodiversity      |
      | Transport/Mobility  | Text Area | Details of transport/mobility  |
      | Maturity Assessment | Text Area | Details of maturity assessment |
      | Maturity            | Text Area | Details of maturity            |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Other adjustments" link is marked as "Incomplete"
    And I click on the "Other adjustments" link
    And I see the following questions on the page are cleared down
      | Question            | Type      |
      | Trauma              | Text Area |
      | Gender              | Text Area |
      | Neurodiversity      | Text Area |
      | Transport/Mobility  | Text Area |
      | Maturity Assessment | Text Area |
      | Maturity            | Text Area |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Other adjustments" page
    And I answer the questions on the page
      | Question            | Type      | Answer                         |
      | Trauma              | Text Area | Details of trauma              |
      | Gender              | Text Area | Details of gender              |
      | Neurodiversity      | Text Area | Details of neurodiversity      |
      | Transport/Mobility  | Text Area | Details of transport/mobility  |
      | Maturity Assessment | Text Area | Details of maturity assessment |
      | Maturity            | Text Area | Details of maturity            |
    And I select "No, I’ll come back later" for the question "Mark the other adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Other adjustments" link is marked as "Incomplete"
    And I click on the "Other adjustments" link
    And I check the answers on the page are as follows
      | Question            | Type      | Answer                         |
      | Trauma              | Text Area | Details of trauma              |
      | Gender              | Text Area | Details of gender              |
      | Neurodiversity      | Text Area | Details of neurodiversity      |
      | Transport/Mobility  | Text Area | Details of transport/mobility  |
      | Maturity Assessment | Text Area | Details of maturity assessment |
      | Maturity            | Text Area | Details of maturity            |

  Scenario: Verify that the user can mark "Other Adjustments" page details as "Completed" and can change to "Incomplete"
    When I see UPW "Other adjustments" page
    And I answer the questions on the page
      | Question            | Type      | Answer                         |
      | Trauma              | Text Area | Details of trauma              |
      | Gender              | Text Area | Details of gender              |
      | Neurodiversity      | Text Area | Details of neurodiversity      |
      | Transport/Mobility  | Text Area | Details of transport/mobility  |
      | Maturity Assessment | Text Area | Details of maturity assessment |
      | Maturity            | Text Area | Details of maturity            |
    And I select "Yes" for the question "Mark the other adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Other adjustments" link is marked as "Completed"
    And I click on the "Other adjustments" link
    And I select "No, I’ll come back later" for the question "Mark the other adjustments section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Other adjustments" link is marked as "Incomplete"
