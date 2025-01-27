Feature: Verify the UPW Risk of harm in the community page

  As a Probation Practitioner
  I can enter Risk of harm in the community information in the ARN UPW assessment
  So I can assess my service users risk in the community

  Background: Navigate to "Risk of harm in the community" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Risk of harm in the community" link

#  #  YES Option for All the Questions and enter details
#  Scenario: Verify that the user can select and enter answers on the "Risk of harm in the community" Page and mark the section as completed
#    When I see UPW "Risk of harm in the community" page
#    And I see "Risk of harm in the community" in page title
#    And I verify that "No, I'll come back later" is Default state on Risk of harm in the community page
#    And I select the Options and enter the details on the "Risk of harm in the community" page as follows
#      | Question Name                                                         | Select Option | Verify the TextBox If Yes | Text to be entered in Give Details               |
#      | History of sexual offending?                                          | Yes           | Give Details              | Entering Text related to sexual offending        |
#      | Individual poses a risk to children?                                  | Yes           | Give Details              | Entering Text related to risk to children        |
#      | Violent offences?                                                     | Yes           | Give Details              | Entering Text related to Violent offences        |
#      | History of acquisitive offending?                                     | Yes           | Give Details              | Entering Text related to acquisitive offending   |
#      | Has the individual been involved in serious group offending (SGO)?    | Yes           | Give Details              | Entering Text related to serious group offending |
#      | Control issues or disruptive behaviour?                               | Yes           | Give Details              | Entering Text related to disruptive behaviour    |
#      | History of hate-based attitudes or behaviours?                        | Yes           | Give Details              | Entering Text related to hate-based attitudes    |
#      | Is the individual vulnerable because they are a high-profile person?  | Yes           | Give Details              | Entering Text related to high-profile person     |
#      | Additional risk assessment information relevant to Community Payback? | Yes           | Give Details              | Entering Text related to Additional information  |
#    And I select "Yes" for Mark this section as complete? for Risk of Harm Community
#    And I click on the "Save" button
#    And I see the UPW "task-list" page
#    And I see the "Risk of harm in the community" link is marked as "Completed"
#
#  #  NO Option for All the Questions and enter details
#  Scenario: Verify that the user can select all Options as "No" on the "Risk of harm in the community" Page
#    When I see UPW "Risk of harm in the community" page
#    And I verify that "No, I'll come back later" is Default state on Risk of harm in the community page
#    Then I select the Options and enter the details on the "Risk of harm in the community" page as follows
#      | Question Name                                                         | Select Option | Verify the TextBox when selected NO |
#      | History of sexual offending?                                          | No            | Give Details is NOT visible         |
#      | Individual poses a risk to children?                                  | No            | Give Details is NOT visible         |
#      | Violent offences?                                                     | No            | Give Details is NOT visible         |
#      | History of acquisitive offending?                                     | No            | Give Details is NOT visible         |
#      | Has the individual been involved in serious group offending (SGO)?    | No            | Give Details is NOT visible         |
#      | Control issues or disruptive behaviour?                               | No            | Give Details is NOT visible         |
#      | History of hate-based attitudes or behaviours?                        | No            | Give Details is NOT visible         |
#      | Is the individual vulnerable because they are a high-profile person?  | No            | Give Details is NOT visible         |
#      | Additional risk assessment information relevant to Community Payback? | No            | Give Details is NOT visible         |
#    And I select "Yes" for Mark this section as complete? for Risk of Harm Community
#    And I click on the "Save" button
#    And I see the UPW "task-list" page
#    And I see the "Risk of harm in the community" link is marked as "Completed"
#
# #  Combination of YES & NO Option for the Questions and enter details when YES
#  Scenario: Verify that the user can select combination of Yes & NO as answers on the "Risk of harm in the community" Page
#    When I see "Risk of harm in the community" in page title
#    And I verify that "No, I'll come back later" is Default state on Risk of harm in the community page
#    And I select the Options and enter the details on the "Risk of harm in the community" page as follows
#      | Question Name                                                         | Select Option | Verify the TextBox          | Text to be entered in Give Details             |
#      | History of sexual offending?                                          | No            | Give Details IS NOT Visible |                                                |
#      | Individual poses a risk to children?                                  | Yes           | Give Details IS Visible     | Entering Text related to risk to children      |
#      | Violent offences?                                                     | No            | Give Details IS NOT Visible |                                                |
#      | History of acquisitive offending?                                     | Yes           | Give Details IS Visible     | Entering Text related to acquisitive offending |
#      | Has the individual been involved in serious group offending (SGO)?    | No            | Give Details IS NOT Visible |                                                |
#      | Control issues or disruptive behaviour?                               | Yes           | Give Details IS Visible     | Entering Text related to disruptive behaviour  |
#      | History of hate-based attitudes or behaviours?                        | No            | Give Details IS NOT Visible |                                                |
#      | Is the individual vulnerable because they are a high-profile person?  | Yes           | Give Details IS Visible     | Entering Text related to high-profile person   |
#      | Additional risk assessment information relevant to Community Payback? | No            | Give Details IS NOT Visible |                                                |
#    And I select "Yes" for Mark this section as complete? for Risk of Harm Community
#    And I click on the "Save" button
#    And I see the UPW "task-list" page
#    And I see the "Risk of harm in the community" link is marked as "Completed"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    And I see UPW "Risk of harm in the community" page
    And I select "Yes" for Mark this section as complete? for Risk of harm in the community
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
    And I select the only "Yes" Options for all the Risk of harm questions and do not enter the details
      | Question Name                                                         | Select Option |
      | History of sexual offending?                                          | Yes           |
      | Individual poses a risk to children?                                  | Yes           |
      | Violent offences?                                                     | Yes           |
      | History of acquisitive offending?                                     | Yes           |
      | Has the individual been involved in serious group offending (SGO)?    | Yes           |
      | Control issues or disruptive behaviour?                               | Yes           |
      | History of hate-based attitudes or behaviours?                        | Yes           |
      | Is the individual vulnerable because they are a high-profile person?  | Yes           |
      | Additional risk assessment information relevant to Community Payback? | Yes           |
    And I select "Yes" for Mark this section as complete? for Risk of harm in the community
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
      | Is the individual vulnerable because they are a high-profile person?  | Enter details of the individual's vulnerabilities           | Enter details of the individual's vulnerabilities          |
      | Additional risk assessment information relevant to Community Payback? | Enter additional risk assessment information                | Enter additional risk assessment information                |

#   Neil has adked me to double check with Andy if this is the expected behaviour
#   ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page
  Scenario: Verify that all the Placement preferences related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Risk of harm in the community" page
    And I select the Options and enter the details on the "Risk of harm in the community" page as follows
      | Question Name                                                         | Select Option | Verify the TextBox If Yes | Text to be entered in Give Details               |
      | History of sexual offending?                                          | Yes           | Give Details              | Entering Text related to sexual offending        |
      | Individual poses a risk to children?                                  | Yes           | Give Details              | Entering Text related to risk to children        |
      | Violent offences?                                                     | Yes           | Give Details              | Entering Text related to Violent offences        |
      | History of acquisitive offending?                                     | Yes           | Give Details              | Entering Text related to acquisitive offending   |
      | Has the individual been involved in serious group offending (SGO)?    | Yes           | Give Details              | Entering Text related to serious group offending |
      | Control issues or disruptive behaviour?                               | Yes           | Give Details              | Entering Text related to disruptive behaviour    |
      | History of hate-based attitudes or behaviours?                        | Yes           | Give Details              | Entering Text related to hate-based attitudes    |
      | Is the individual vulnerable because they are a high-profile person?  | Yes           | Give Details              | Entering Text related to high-profile person     |
      | Additional risk assessment information relevant to Community Payback? | Yes           | Give Details              | Entering Text related to Additional information  |
    And I click on back link
    And I see the UPW "task-list" page
    Then I see the "Risk of harm in the community" link is marked as "Incomplete"
    And I click on the "Risk of harm in the community" link
    And I verify that the Risk of harm related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Risk of harm in the community" page
    And I select the Options and enter the details on the "Risk of harm in the community" page as follows
      | Question Name                                                         | Select Option | Text to be entered in Give Details             |
      | History of sexual offending?                                          | No            |                                                |
      | Individual poses a risk to children?                                  | Yes           | Entering Text related to risk to children      |
      | Violent offences?                                                     | No            |                                                |
      | History of acquisitive offending?                                     | Yes           | Entering Text related to acquisitive offending |
      | Has the individual been involved in serious group offending (SGO)?    | No            |                                                |
      | Control issues or disruptive behaviour?                               | Yes           | Entering Text related to disruptive behaviour? |
      | History of hate-based attitudes or behaviours?                        | No            |                                                |
      | Is the individual vulnerable because they are a high-profile person?  | Yes           | Entering Text related to high-profile person?  |
      | Additional risk assessment information relevant to Community Payback? | No            |                                                |
    And I select "No, I'll come back later" for Mark this section as complete? for Risk of harm in the community
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Risk of harm in the community" link is marked as "Incomplete"
    And I click on the "Risk of harm in the community" link
    And I verify that the Risk of harm related related radio buttons are still selected & unselected
      | Question Name                                                         | Select Option |
      | History of sexual offending?                                          | No            |
      | Individual poses a risk to children?                                  | Yes           |
      | Violent offences?                                                     | No            |
      | History of acquisitive offending?                                     | Yes           |
      | Has the individual been involved in serious group offending (SGO)?    | No            |
      | Control issues or disruptive behaviour?                               | Yes           |
      | History of hate-based attitudes or behaviours?                        | No            |
      | Is the individual vulnerable because they are a high-profile person?  | Yes           |
      | Additional risk assessment information relevant to Community Payback? | No            |
