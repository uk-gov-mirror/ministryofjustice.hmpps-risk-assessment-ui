Feature: Verify the Gender information page

  As a Probation Practitioner
  I can update details relating to my Service Users gender
  So that we correctly assess their suitability for unpaid work

  Background: Navigate to "Gender information" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Gender information" link

  Scenario Outline: Verify that the "Placement preferences" link is only displayed on the task-list page when the gender is not equal to "Male"
    When I see UPW "Gender information" page
    And I select the all the Options as Yes and select "Gender Identity" as "<gender>"
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see that "Placement preferences" link is available
    Examples:
      | gender                  |
      | Female                  |
      | Non-binary              |
      | Prefer to self-describe |
      | Prefer not to say       |

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Gender information" page
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    Then I see the following Gender information Summary and Field error messages for "Questions"
      | Question Name                                                                        | Summary Error Messages                                                                                                                                                           | Field Error Messages                                                                                                                                                             |
      | Gender identity                                                                      | Select a Gender Identity option                                                                                                                                                  | Select a Gender Identity option                                                                                                                                                  |
      | Has the individual gone through any part of a process to change the sex              | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? Select yes or no | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? Select yes or no |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? Select yes or no                                                                            | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? Select yes or no                                                                            |
      | Do they consider themselves to be transgender or have a transgender history?         | Do they consider themselves to be transgender or have a transgender history? Select yes or no                                                                                    | Do they consider themselves to be transgender or have a transgender history? Select yes or no                                                                                    |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions and without entering details to verify the error messages
    When I see UPW "Gender information" page
    And I select the only "Yes" Options for all the Gender information questions and do not enter the details
      | Question Name                                                                        | Select Option |
      | Gender identity                                                                      | Female        |
      | Has the individual gone through any part of a process to change the sex              | Yes           |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? | Yes           |
      | Do they consider themselves to be transgender or have a transgender history?         | Yes           |
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    Then I see the following Gender information Summary and Field error messages for "Give Details"
      | Give Details for Questions                                              | Summary Error Messages                                                                         | Field Error Messages                                                                           |
      | Has the individual gone through any part of a process to change the sex | Enter details of gender identity and relevant placement options discussed with the individual. | Enter details of gender identity and relevant placement options discussed with the individual. |

#   ARN-742 UPW Task list pages - Gender information - Clicking on "Back" Link is not clearing the values on the Gender information Page
  Scenario: Verify that all the Gender information related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Gender information" page
    And I select the Options and enter the details on the "Gender information" page as follows
      | Question Name                                                                        | Select Option | Text to be entered in Give Details  |
      | Gender identity                                                                      | Female        |                                     |
      | Has the individual gone through any part of a process to change the sex              | Yes           | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? | Yes           |                                     |
      | Do they consider themselves to be transgender or have a transgender history?         | Yes           |                                     |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Gender information" link is marked as "Incomplete"
    And I click on the "Gender information" link
    Then I verify that the Gender information related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Gender information" page
    And I select the Options and enter the details on the "Gender information" page as follows
      | Question Name                                                                        | Select Option | Text to be entered in Give Details  |
      | Gender identity                                                                      | Female        |                                     |
      | Has the individual gone through any part of a process to change the sex              | Yes           | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? | Yes           |                                     |
      | Do they consider themselves to be transgender or have a transgender history?         | Yes           |                                     |
    And I select "No, I'll come back later" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Gender information" link is marked as "Incomplete"
    And I click on the "Gender information" link
    Then I verify that the Gender information related radio buttons are still selected & unselected
      | Question Name                                                                        | Select Option |
      | Gender identity                                                                      | Female        |
      | Has the individual gone through any part of a process to change the sex              | Yes           |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)? | Yes           |
      | Do they consider themselves to be transgender or have a transgender history?         | Yes           |

  Scenario: Verify that the user can select and enter answers on the "Gender information" Page and mark the section as completed
    When I see UPW "Gender information" page
    And I see that "No, I'll come back later" is Default state on Gender information page
    And I select the Options and enter the details on the "Gender information" page as follows
      | Question Name                                                                                                                                                   | Select Option | Text to be entered in Give Details  |
      | Gender identity                                                                                                                                                 | Male          |                                     |
      | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? | Yes           | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)?                                                                            | Yes           |                                     |
      | Do they consider themselves to be transgender or have a transgender history?                                                                                    | Yes           |                                     |
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Gender information" link is marked as "Completed"
    And I see that "Placement preferences" link is not available
