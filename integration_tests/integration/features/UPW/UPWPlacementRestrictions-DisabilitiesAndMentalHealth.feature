Feature: Verify the Disabilities and mental health page
  As a Probation Practitioner
  I can enter disability and mental health information
  So that I can assess my service users disability and mental health needs

  Background: Navigate to "Disabilities and mental health" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Disabilities and mental health" link

  Scenario: Verify that the user can select and enter answers on the "Disabilities and mental health" Page and mark the section as completed
    When I see UPW "Disabilities and mental health" page
    And I check that "No, I’ll come back later" is selected for "Mark disabilities and mental health section as complete?"
#    And I verify that both questions are selected by default as NO
    And I answer the questions on the page
      | Question                                                                                                            | Type  | Answer | Details                                            |
      | Any additional disabilities or health issues that affect the individual’s ability to engage with Community Payback? | Radio | Yes    | Entering Text related to the Additional disability |
      | Do any of the above affect the individual’s ability to engage with Community Payback?                               | Radio | Yes    | Entering Text related to the disability            |
    And I select "Yes" for the question "Mark disabilities and mental health section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Disabilities and mental health" link is marked as "Completed"
#  ARN-742 UPW Task list pages - Disabilities and mental health - Clicking on "Back" Link is not clearing the values on the Disabilities and mental health Page

  Scenario: Verify that all the Disabilities and mental health related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Disabilities and mental health" page
    And I answer the questions on the page
      | Question                                                                                                            | Type  | Answer | Details                                            |
      | Any additional disabilities or health issues that affect the individual’s ability to engage with Community Payback? | Radio | Yes    | Entering Text related to the Additional disability |
      | Do any of the above affect the individual’s ability to engage with Community Payback?                               | Radio | Yes    | Entering Text related to the disability            |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Disabilities and mental health" link is marked as "Incomplete"
    And I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    Then I see the following questions on the page are cleared down
      | Question                                                                                                            | Type  |
      | Any additional disabilities or health issues that affect the individual’s ability to engage with Community Payback? | Radio |
      | Do any of the above affect the individual’s ability to engage with Community Payback?                               | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Disabilities and mental health" page
    And I answer the questions on the page
      | Question                                                                                                            | Type  | Answer | Details                                            |
      | Any additional disabilities or health issues that affect the individual’s ability to engage with Community Payback? | Radio | Yes    | Entering Text related to the Additional disability |
      | Do any of the above affect the individual’s ability to engage with Community Payback?                               | Radio | Yes    | Entering Text related to the disability            |
    And I select "No, I’ll come back later" for the question "Mark disabilities and mental health section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Disabilities and mental health" link is marked as "Incomplete"
    And I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    Then I verify that the Disabilities and mental health related radio buttons are still selected & unselected
      | Question Name                                                                         | Select Option |
      | Do any of the above affect the individual’s ability to engage with Community Payback? | Yes           |
      | Do any of the above affect the individual’s ability to engage with Community Payback? | yes           |
