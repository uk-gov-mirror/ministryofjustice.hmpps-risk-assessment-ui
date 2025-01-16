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
    And I see that "No, I'll come back later" is Default state on Disabilities and mental health page
#    And I verify that both questions are selected by default as NO
    And I select the Options and enter the details on the "Disabilities and mental health" page as follows
      | Question Name                                                                                                      | Select Option | Text to be entered in Give Details                 |
      | Any additional disabilities or health issues that affect the individuals ability to engage with Community Payback? | Yes           | Entering Text related to the Additional disability |
      | Do any one of the above affect the individual's ability to engage with Community Payback?                          | Yes           | Entering Text related to the disability            |
    And I select "Yes" for Mark this section as complete? for Disabilities and mental health
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Disabilities and mental health" link is marked as "COMPLETED"

#  ARN-742 UPW Task list pages - Disabilities and mental health - Clicking on "Back" Link is not clearing the values on the Disabilities and mental health Page
  Scenario: Verify that all the Disabilities and mental health related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Disabilities and mental health" page
    And I select the Options and enter the details on the "Disabilities and mental health" page as follows
      | Question Name                                                                                                      | Select Option | Text to be entered in Give Details                 |
      | Any additional disabilities or health issues that affect the individuals ability to engage with Community Payback? | Yes           | Entering Text related to the Additional disability |
      | Do any one of the above affect the individual's ability to engage with Community Payback?                          | yes           | Entering Text related to the disability            |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Disabilities and mental health" link is marked as "INCOMPLETE"
    And I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    Then I verify that the Disabilities and mental health related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Disabilities and mental health" page
    And I select the Options and enter the details on the "Disabilities and mental health" page as follows
      | Question Name                                                                                                      | Select Option | Text to be entered in Give Details                 |
      | Any additional disabilities or health issues that affect the individuals ability to engage with Community Payback? | Yes           | Entering Text related to the Additional disability |
      | Do any one of the above affect the individual's ability to engage with Community Payback?                          | Yes           | Entering Text related to the disability            |
    And I select "No, I'll come back later" for Mark this section as complete? for Disabilities and mental health
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Disabilities and mental health" link is marked as "INCOMPLETE"
    And I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    Then I verify that the Disabilities and mental health related radio buttons are still selected & unselected
      | Question Name                                                                             | Select Option |
      | Do any one of the above affect the individual's ability to engage with Community Payback? | Yes           |
      | Do any one of the above affect the individual's ability to engage with Community Payback? | yes           |
