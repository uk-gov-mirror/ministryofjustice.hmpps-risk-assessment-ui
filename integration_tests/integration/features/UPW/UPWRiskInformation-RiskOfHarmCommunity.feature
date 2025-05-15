Feature: Verify the UPW Risk of harm in the community page
  As a Probation Practitioner
  I can enter Risk of harm in the community information in the ARN UPW assessment
  So I can assess my service users risk in the community

  Background: Navigate to "Risk of harm in the community" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Risk of harm in the community" link

  Scenario: Verify that the user can select and enter answers on the "Risk of harm in the community" Page and mark the section as completed
    When I see UPW "Risk of harm in the community" page
    And I see "Risk of harm in the community" in page title
    And I check that "No, I’ll come back later" is selected for "Mark risk of harm in the community section as complete?"
    And I answer the questions on the page
      | Question                                                              | Type  | Answer | Details                                                      |
      | History of sexual offending?                                          | Radio | Yes    | Entering Text related to sexual offending                    |
      | Individual poses a risk to children?                                  | Radio | Yes    | Entering Text related to risk to children                    |
      | Violent offences?                                                     | Radio | Yes    | Entering Text related to Violent offences                    |
      | History of acquisitive offending?                                     | Radio | Yes    | Entering Text related to acquisitive offending               |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | Yes    | Entering Text related to serious group offending             |
      | Control issues or disruptive behaviour?                               | Radio | Yes    | Entering Text related to disruptive behaviour                |
      | History of hate-based attitudes or behaviours?                        | Radio | Yes    | Entering Text related to hate-based attitudes                |
      | History of offending against vulnerable adults?                       | Radio | Yes    | Entering Text related to offending against vulnerable adults |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | Yes    | Entering Text related to high-profile person                 |
      | Additional risk assessment information relevant to Community Payback? | Radio | Yes    | Entering Text related to Additional information              |
    And I select "Yes" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Risk of harm in the community" link is marked as "Completed"

  Scenario: Verify that the user can select all Options as "No" on the "Risk of harm in the community" Page
    When I see UPW "Risk of harm in the community" page
    And I check that "No, I’ll come back later" is selected for "Mark risk of harm in the community section as complete?"
    And I answer the questions on the page
      | Question                                                              | Type  | Answer |
      | History of sexual offending?                                          | Radio | No     |
      | Individual poses a risk to children?                                  | Radio | No     |
      | Violent offences?                                                     | Radio | No     |
      | History of acquisitive offending?                                     | Radio | No     |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | No     |
      | Control issues or disruptive behaviour?                               | Radio | No     |
      | History of hate-based attitudes or behaviours?                        | Radio | No     |
      | History of offending against vulnerable adults?                       | Radio | No     |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | No     |
      | Additional risk assessment information relevant to Community Payback? | Radio | No     |
    And I select "Yes" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Risk of harm in the community" link is marked as "Completed"

  Scenario: Verify that the user can select combination of Yes & NO as answers on the "Risk of harm in the community" Page
    When I see "Risk of harm in the community" in page title
    And I check that "No, I’ll come back later" is selected for "Mark risk of harm in the community section as complete?"
    And I answer the questions on the page
      | Question                                                              | Type  | Answer | Details                                                      |
      | History of sexual offending?                                          | Radio | No     |                                                              |
      | Individual poses a risk to children?                                  | Radio | Yes    | Entering Text related to risk to children                    |
      | Violent offences?                                                     | Radio | No     |                                                              |
      | History of acquisitive offending?                                     | Radio | Yes    | Entering Text related to acquisitive offending               |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | No     |                                                              |
      | Control issues or disruptive behaviour?                               | Radio | Yes    | Entering Text related to disruptive behaviour                |
      | History of hate-based attitudes or behaviours?                        | Radio | No     |                                                              |
      | History of offending against vulnerable adults?                       | Radio | Yes    | Entering Text related to offending against vulnerable adults |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | No     |                                                              |
      | Additional risk assessment information relevant to Community Payback? | Radio | Yes    | Entering Text related to Additional information              |
    And I select "Yes" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Risk of harm in the community" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    And I see UPW "Risk of harm in the community" page
    And I select "Yes" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    Then I see the following Summary and Field error messages for "Questions"
      | Question Name                                                         | Summary Error Messages                                                                          | Field Error Messages                                                                            |
      | History of sexual offending?                                          | Is there a history of sexual offending? Select yes or no                                        | Is there a history of sexual offending? Select yes or no                                        |
      | Individual poses a risk to children?                                  | Does the individual pose a risk to children? Select yes or no                                   | Does the individual pose a risk to children? Select yes or no                                   |
      | Violent offences?                                                     | Is there a history of violent offences? Select yes or no                                        | Is there a history of violent offences? Select yes or no                                        |
      | History of acquisitive offending?                                     | Is there a history of acquisitive offending? Select yes or no                                   | Is there a history of acquisitive offending? Select yes or no                                   |
      | Has the individual been involved in serious group offending (SGO)?    | Has the individual been involved in serious group offending? Select yes or no                   | Has the individual been involved in serious group offending? Select yes or no                   |
      | Control issues or disruptive behaviour?                               | Has the individual had control issues or disruptive behaviour? Select yes or no                 | Has the individual had control issues or disruptive behaviour? Select yes or no                 |
      | History of hate-based attitudes or behaviours?                        | Does the individual have a history of hate-based attitudes or behaviours? Select yes or no      | Does the individual have a history of hate-based attitudes or behaviours? Select yes or no      |
      | Is the individual vulnerable because they are a high-profile person?  | Is the individual vulnerable because they are a high-profile person? Select yes or no           | Is the individual vulnerable because they are a high-profile person? Select yes or no           |
      | Additional risk assessment information relevant to Community Payback? | Is there additional risk assessment information relevant to Community Payback? Select yes or no | Is there additional risk assessment information relevant to Community Payback? Select yes or no |

  Scenario: Try to continue by selecting "Yes" Option for all of the Questions & without entering details and verify the error messages
    When I see UPW "Risk of harm in the community" page
    And I answer the questions on the page
      | Question                                                              | Type  | Answer |
      | History of sexual offending?                                          | Radio | Yes    |
      | Individual poses a risk to children?                                  | Radio | Yes    |
      | Violent offences?                                                     | Radio | Yes    |
      | History of acquisitive offending?                                     | Radio | Yes    |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | Yes    |
      | Control issues or disruptive behaviour?                               | Radio | Yes    |
      | History of hate-based attitudes or behaviours?                        | Radio | Yes    |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | Yes    |
      | Additional risk assessment information relevant to Community Payback? | Radio | Yes    |
    And I select "Yes" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    Then I see the following Summary and Field error messages for "Give Details"
      | Give Details for Questions                                            | Summary Error Messages                                      | Field Error Messages                                        |
      | History of sexual offending?                                          | Enter details of the sexual offending                       | Enter details of the sexual offending                       |
      | Individual poses a risk to children?                                  | Enter details of the risk posed to children                 | Enter details of the risk posed to children                 |
      | Violent offences?                                                     | Enter details of the violent offences                       | Enter details of the violent offences                       |
      | History of acquisitive offending?                                     | Enter details of the acquisitive offending                  | Enter details of the acquisitive offending                  |
      | Has the individual been involved in serious group offending (SGO)?    | Enter details of the serious group offending (SGO)          | Enter details of the serious group offending (SGO)          |
      | Control issues or disruptive behaviour?                               | Enter details of the control issues or disruptive behaviour | Enter details of the control issues or disruptive behaviour |
      | History of hate-based attitudes or behaviours?                        | Enter details of the hate-based attitudes or behaviours     | Enter details of the hate-based attitudes or behaviours     |
      | Is the individual vulnerable because they are a high-profile person?  | Enter details of the individual's vulnerabilities           | Enter details of the individual's vulnerabilities           |
      | Additional risk assessment information relevant to Community Payback? | Enter additional risk assessment information                | Enter additional risk assessment information                |
#   Neil has adked me to double check with Andy if this is the expected behaviour
#   ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page

  Scenario: Verify that all the Placement preferences related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Risk of harm in the community" page
    And I answer the questions on the page
      | Question                                                              | Type  | Answer | Details                                          |
      | History of sexual offending?                                          | Radio | Yes    | Entering Text related to sexual offending        |
      | Individual poses a risk to children?                                  | Radio | Yes    | Entering Text related to risk to children        |
      | Violent offences?                                                     | Radio | Yes    | Entering Text related to Violent offences        |
      | History of acquisitive offending?                                     | Radio | Yes    | Entering Text related to acquisitive offending   |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | Yes    | Entering Text related to serious group offending |
      | Control issues or disruptive behaviour?                               | Radio | Yes    | Entering Text related to disruptive behaviour    |
      | History of hate-based attitudes or behaviours?                        | Radio | Yes    | Entering Text related to hate-based attitudes    |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | Yes    | Entering Text related to high-profile person     |
      | Additional risk assessment information relevant to Community Payback? | Radio | Yes    | Entering Text related to Additional information  |
    And I click on back link
    And I see the UPW "task-list" page
    Then I see the "Risk of harm in the community" link is marked as "Incomplete"
    And I click on the "Risk of harm in the community" link
    And I see the following questions on the page are cleared down
      | Question                                                              | Type  |
      | History of sexual offending?                                          | Radio |
      | Individual poses a risk to children?                                  | Radio |
      | Violent offences?                                                     | Radio |
      | History of acquisitive offending?                                     | Radio |
      | Has the individual been involved in serious group offending (SGO)?    | Radio |
      | Control issues or disruptive behaviour?                               | Radio |
      | History of hate-based attitudes or behaviours?                        | Radio |
      | Is the individual vulnerable because they are a high-profile person?  | Radio |
      | Additional risk assessment information relevant to Community Payback? | Radio |

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Risk of harm in the community" page
    And I answer the questions on the page
      | Question                                                              | Type  | Answer | Details                                        |
      | History of sexual offending?                                          | Radio | No     |                                                |
      | Individual poses a risk to children?                                  | Radio | Yes    | Entering Text related to risk to children      |
      | Violent offences?                                                     | Radio | No     |                                                |
      | History of acquisitive offending?                                     | Radio | Yes    | Entering Text related to acquisitive offending |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | No     |                                                |
      | Control issues or disruptive behaviour?                               | Radio | Yes    | Entering Text related to disruptive behaviour? |
      | History of hate-based attitudes or behaviours?                        | Radio | No     |                                                |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | Yes    | Entering Text related to high-profile person?  |
      | Additional risk assessment information relevant to Community Payback? | Radio | No     |                                                |
    And I select "No, I’ll come back later" for the question "Mark risk of harm in the community section as complete?"
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Risk of harm in the community" link is marked as "Incomplete"
    And I click on the "Risk of harm in the community" link
    And I check the answers on the page are as follows
      | Question                                                              | Type  | Answer | Details                                        |
      | History of sexual offending?                                          | Radio | No     |                                                |
      | Individual poses a risk to children?                                  | Radio | Yes    | Entering Text related to risk to children      |
      | Violent offences?                                                     | Radio | No     |                                                |
      | History of acquisitive offending?                                     | Radio | Yes    | Entering Text related to acquisitive offending |
      | Has the individual been involved in serious group offending (SGO)?    | Radio | No     |                                                |
      | Control issues or disruptive behaviour?                               | Radio | Yes    | Entering Text related to disruptive behaviour? |
      | History of hate-based attitudes or behaviours?                        | Radio | No     |                                                |
      | Is the individual vulnerable because they are a high-profile person?  | Radio | Yes    | Entering Text related to high-profile person?  |
      | Additional risk assessment information relevant to Community Payback? | Radio | No     |                                                |
