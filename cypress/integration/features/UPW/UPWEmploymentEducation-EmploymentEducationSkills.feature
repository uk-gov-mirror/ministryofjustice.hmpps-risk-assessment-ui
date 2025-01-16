Feature: Verify the Employment, education and skills page

  As a Probation Practitioner
  I can edit employment or education details
  So that I can edit the details held against the service user

  Background: Navigate to " Employment, education and skills" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Employment, education and skills" link

  #  YES Option for All the Questions and enter details - Full-time education or employment
  Scenario: Verify that the user can select and answers on the "Employment, education and skills" Page and mark the section as completed - Full-time education or employment
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
    And I verify that "No, I'll come back later" is Default state on Employment, education and skills page
    And I select the Options and enter the details on the "Employment, education and skills" page as follows
      | Question Name                                                                                                   | Select Option                     | Text to be entered in Give Details            |
      | Is the individual in employment or education?                                                                   | Full-time education or employment | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               | Entering Text related to future work plans    |
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "COMPLETED"

  #  YES Option for All the Questions and enter details - Part-time education or employment
  Scenario: Verify that the user can select and answers on the "Employment, education and skills" Page and mark the section as completed - Part-time education or employment
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
    And I verify that "No, I'll come back later" is Default state on Employment, education and skills page
    And I select the Options and enter the details on the "Employment, education and skills" page as follows
      | Question Name                                                                                                   | Select Option                     | Text to be entered in Give Details            |
      | Is the individual in employment or education?                                                                   | Part-time education or employment | Entering Text related to Part-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               | Entering Text related to future work plans    |
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "COMPLETED"

 #  NO Option for the Questions
  Scenario: Verify that the user can select combination of Yes & NO as answers on the "Employment, education and skills" Page
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
    And I select the Options and enter the details on the "Employment, education and skills" page as follows
      | Question Name                                                                                                   | Select Option |
      | Is the individual in employment or education?                                                                   | No            |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | No            |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | No            |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | No            |
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "COMPLETED"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Employment, education and skills" page
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    Then I see the following Employment, education and skills Summary and Field error messages for "Questions"
      | Question Name                                                                                                   | Summary Error Messages | Field Error Messages |
      | Is the individual in employment or education?                                                                   | Select an option       | Select an option     |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Select yes or no       | Select yes or no     |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Select yes or no       | Select yes or no     |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Select yes or no       | Select yes or no     |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions and without entering details
    When I see UPW "Employment, education and skills" page
    And I select the only "Yes" Options for all the Employment, education and skills questions and do not enter the details
      | Question Name                                                                                                   | Select Option                     |
      | Is the individual in employment or education?                                                                   | Full-time education or employment |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Yes                               |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               |
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    Then I see the following Employment, education and skills Summary and Field error messages for "Give Details"
      | Give Details for Questions                                                                                      | Summary Error Messages | Field Error Messages |
      | Is the individual in employment or education?                                                                   | Enter details          | Enter details        |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Enter details          | Enter details        |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Enter details          | Enter details        |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Enter details          | Enter details        |

  # ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page
  Scenario: Verify that all the Employment, education & skills related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Employment, education and skills" page
    And I select the Options and enter the details on the "Employment, education and skills" page as follows
      | Question Name                                                                                                   | Select Option                     | Text to be entered in Give Details            |
      | Is the individual in employment or education?                                                                   | Full-time education or employment | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               | Entering Text related to future work plans    |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Employment, education and skills" link is marked as "INCOMPLETE"
    And I click on the "Employment, education and skills" link
    Then I verify that the Employment, education and skills related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/entered values are saved
    When I see UPW "Employment, education and skills" page
    And I select the Options and enter the details on the "Employment, education and skills" page as follows
      | Question Name                                                                                                   | Select Option                     | Text to be entered in Give Details           |
      | Is the individual in employment or education?                                                                   | Full-time education or employment | Entering Text related to Full-time education |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | No                                |                                              |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills         |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | No                                |                                              |
    And I select "No, I'll come back later" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "INCOMPLETE"
    And I click on the "Employment, education and skills" link
    Then I verify that the Employment, education related related radio buttons are still selected & unselected
      | Question Name                                                                                                   | Select Option                     |
      | Is the individual in employment or education?                                                                   | Full-time education or employment |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | No                                |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | No                                |
