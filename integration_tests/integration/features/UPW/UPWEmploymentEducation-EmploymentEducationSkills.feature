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
    And I check that "No, I’ll come back later" is selected for "Mark employment, education and skills section as complete?"
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer                            | Details                                       |
      | Is the individual in employment or education?                                                                   | Radio | Full-time education or employment | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | Yes                               | Entering Text related to future work plans    |
    And I select "Yes" for the question "Mark employment, education and skills section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "Completed"
  #  YES Option for All the Questions and enter details - Part-time education or employment

  Scenario: Verify that the user can select and answers on the "Employment, education and skills" Page and mark the section as completed - Part-time education or employment
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
    And I check that "No, I’ll come back later" is selected for "Mark employment, education and skills section as complete?"
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer                            | Details                                       |
      | Is the individual in employment or education?                                                                   | Radio | Part-time education or employment | Entering Text related to Part-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | Yes                               | Entering Text related to future work plans    |
    And I select "Yes" for the question "Mark employment, education and skills section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "Completed"
 #  NO Option for the Questions

  Scenario: Verify that the user can select combination of Yes & NO as answers on the "Employment, education and skills" Page
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer |
      | Is the individual in employment or education?                                                                   | Radio | No     |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | No     |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | No     |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | No     |
    And I select "Yes" for the question "Mark employment, education and skills section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Employment, education and skills" page
    And I select "Yes" for the question "Mark employment, education and skills section as complete?"
    And I click on the "Save" button
    Then I see the following Employment, education and skills Summary and Field error messages for "Questions"
      | Question Name                                                                                                   | Summary Error Messages | Field Error Messages |
      | Is the individual in employment or education?                                                                   | Select an option       | Select an option     |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Select yes or no       | Select yes or no     |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Select yes or no       | Select yes or no     |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Select yes or no       | Select yes or no     |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions and without entering details
    When I see UPW "Employment, education and skills" page
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer                            |
      | Is the individual in employment or education?                                                                   | Radio | Full-time education or employment |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | Yes                               |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | Yes                               |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | Yes                               |
    And I select "Yes" for the question "Mark employment, education and skills section as complete?"
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
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer                            | Details                                       |
      | Is the individual in employment or education?                                                                   | Radio | Full-time education or employment | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | Yes                               | Entering Text related to future work plans    |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Employment, education and skills" link is marked as "Incomplete"
    And I click on the "Employment, education and skills" link
    Then I see the following questions on the page are cleared down
      | Question                                                                                                        | Type  |
      | Is the individual in employment or education?                                                                   | Radio |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/entered values are saved
    When I see UPW "Employment, education and skills" page
    And I answer the questions on the page
      | Question                                                                                                        | Type  | Answer                            | Details                                      |
      | Is the individual in employment or education?                                                                   | Radio | Full-time education or employment | Entering Text related to Full-time education |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Radio | No                                |                                              |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Radio | Yes                               | Entering Text related to work skills         |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Radio | No                                |                                              |
    And I select "No, I’ll come back later" for the question "Mark employment, education and skills section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "Incomplete"
    And I click on the "Employment, education and skills" link
    Then I verify that the Employment, education related related radio buttons are still selected & unselected
      | Question Name                                                                                                   | Select Option                     |
      | Is the individual in employment or education?                                                                   | Full-time education or employment |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | No                                |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | No                                |
