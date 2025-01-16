Feature: Verify the Managing risk page

  As a Probation Practitioner
  I can enter Managing risk information in the ARN UPW assessment
  So I can Manage my service users risk

  Background: Navigate to "Managing risk" page
    Given I login and navigate to UPW Task list page with dataDriven CRN
    And I see the UPW "task-list" page
    And I click on the "Managing risk" link

  Scenario: Verify that the user can select and enter answers on the "Managing risk" Page and mark the section as completed
    When I see UPW "Managing risk" page
    And I see that "No, I'll come back later" is Default state on Managing risk page
    And I select the Options and enter the details on the "Managing Risk" page as follows
      | Question Name                                                         | Select Option | Text to be entered in Give Details                                       |
      | Location restricted by victim exclusion criteria?                     | Yes           | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                | Yes           | Entering Text related to restricted placement      |
      | Recommend not to place with female supervisor?                        | Yes           | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                          | Yes           | Entering Text related to male supervisor   		   |
      | Restrictive orders? (non-molestation, injunction etc.)			   	  | Yes           | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?     | Yes           | Entering Text related to individual placement      |
      | Are there any risk management issues if working in a supervised group?| Yes           | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact? 				  | Yes           | Entering Text related to health and safety impact  |
    And I select "Yes" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Managing risk" link is marked as "COMPLETED"

  Scenario: Try to continue without selecting any of the options and verify the error messages
    When I see UPW "Managing risk" page
    And I select "Yes" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    Then I see the following Managing Risk Summary and Field error messages for "Questions"
      | Question Name                                                           | Summary Error Messages                                                                  | Field Error Messages                                                                    |
      | Location restricted by victim exclusion criteria?                       | Is the individual's location restricted by victim exclusion criteria? Select yes or no  | Is the individual's location restricted by victim exclusion criteria? Select yes or no  |
      | Close supervision or restricted placement recommended?                  | Is close supervision or restricted placement recommended? Select yes or no              | Is close supervision or restricted placement recommended? Select yes or no              |
      | Recommend not to place with female supervisor?                          | Do you recommend not to place with a female supervisor? Select yes or no                | Do you recommend not to place with a female supervisor? Select yes or no                |
      | Recommend not to place with male supervisor?                            | Do you recommend not to place with a male supervisor? Select yes or no                  | Do you recommend not to place with a male supervisor? Select yes or no                  |
      | Restrictive orders? (non-molestation, injunction etc.)                  | Are there restrictive orders? Select yes or no                                          | Are there restrictive orders? Select yes or no                                          |
      | Are there any risk management issues for an individual placement?       | Are there any risk management issues for an individual placement? Select yes or no      | Are there any risk management issues for an individual placement? Select yes or no      |
      | Are there any risk management issues if working in a supervised group?  | Are there any risk management issues if working in a supervised group? Select yes or no | Are there any risk management issues if working in a supervised group? Select yes or no |
      | Alcohol or drug issues with health and safety impact?                   | Are there any alcohol or drug issues with health and safety impact? Select yes or no    | Are there any alcohol or drug issues with health and safety impact? Select yes or no    |


  Scenario: Try to continue by selecting "Yes" Option for all of the Questions & without entering details and verify the error messages
    When I see UPW "Managing risk" page
    And I select the only "Yes" Options for all the Managing Risk questions and do not enter the details
      | Question Name                                                         | Select Option |
      | Location restricted by victim exclusion criteria?                     | Yes           |
      | Close supervision or restricted placement recommended?                | Yes           |
      | Recommend not to place with female supervisor?                        | Yes           |
      | Recommend not to place with male supervisor?                          | Yes           |
      | Restrictive orders? (non-molestation, injunction etc.)			   	  | Yes           |
      | Are there any risk management issues for an individual placement?     | Yes           |
      | Are there any risk management issues if working in a supervised group?| Yes           |
      | Alcohol or drug issues with health and safety impact? 				  | Yes           |
    And I select "Yes" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    Then I see the following Managing Risk Summary and Field error messages for "Give Details"
      | Give Details for Questions                                             | Summary Error Messages                                                      | Field Error Messages                                                        |
      | Location restricted by victim exclusion criteria?                      | Enter details of the location restrictions due to victim exclusion criteria | Enter details of the location restrictions due to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                 | Enter details of the close supervision or restricted placement recommended  | Enter details of the close supervision or restricted placement recommended  |
      | Recommend not to place with female supervisor?                         | Enter details of why not to place individual with female supervisor         | Enter details of why not to place individual with female supervisor         |
      | Recommend not to place with male supervisor?                           | Enter details of why not to place individual with male supervisor           | Enter details of why not to place individual with male supervisor           |
      | Restrictive orders? (non-molestation, injunction etc.)                 | Enter details of restrictive orders                                         | Enter details of restrictive orders                                         |
      | Are there any risk management issues for an individual placement?      | Enter details of risk management issues for an individual placement         | Enter details of risk management issues for an individual placement         |
      | Are there any risk management issues if working in a supervised group? | Enter details of risk management issues if working in a supervised group    | Enter details of risk management issues if working in a supervised group    |
      | Alcohol or drug issues with health and safety impact? 	               | Enter details of alcohol or drug issues with health and safety impact       | Enter details of alcohol or drug issues with health and safety impact       |
      | Additional risk assessment information relevant to Community Payback?  | Enter details                                                               | Enter details                                                               |

#   ARN-742 UPW Task list pages - Managing Risk - Clicking on "Back" Link is not clearing the values on the Managing Risk Page
  Scenario: Verify that all the Managing risk related values are cleared when the user navigates to Task List Page by clicking "Back" link
    When I see UPW "Managing risk" page
    And I select the Options and enter the details on the "Managing Risk" page as follows
      | Question Name                                                         | Select Option | Text to be entered in Give Details                                       |
      | Location restricted by victim exclusion criteria?                     | Yes           | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                | Yes           | Entering Text related to restricted placement      |
      | Recommend not to place with female supervisor?                        | Yes           | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                          | Yes           | Entering Text related to male supervisor   		   |
      | Restrictive orders? (non-molestation, injunction etc.)			   	  | Yes           | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?     | Yes           | Entering Text related to individual placement      |
      | Are there any risk management issues if working in a supervised group?| Yes           | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact? 				  | Yes           | Entering Text related to health and safety impact  |
    And I click on back link
    And I see the UPW "task-list" page
    And I see the "Managing risk" link is marked as "INCOMPLETE"
    And I click on the "Managing risk" link
    Then I verify that the Managing risk related radio buttons are cleared

  Scenario: Verify that user that user can navigate to Task List page on clicking "No, I’ll come back later" button and selected/enter values are saved
    When I see UPW "Managing risk" page
    And I select the Options and enter the details on the "Managing Risk" page as follows
      | Question Name                                                         | Select Option | Text to be entered in Give Details                                       |
      | Location restricted by victim exclusion criteria?                     | Yes           | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                | No            |                                                    |
      | Recommend not to place with female supervisor?                        | Yes           | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                          | No            |  		                                           |
      | Restrictive orders? (non-molestation, injunction etc.)			   	  | Yes           | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?     | No            |                                                    |
      | Are there any risk management issues if working in a supervised group?| Yes           | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact? 				  | No            |                                                    |
    And I select "No, I'll come back later" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Managing risk" link is marked as "INCOMPLETE"
    And I click on the "Managing risk" link
    Then I verify that the Managing risk related radio buttons are still selected & unselected
      | Question Name                                                         | Select Option |
      | Location restricted by victim exclusion criteria?                     | Yes           |
      | Close supervision or restricted placement recommended?                | No            |
      | Recommend not to place with female supervisor?                        | Yes           |
      | Recommend not to place with male supervisor?                          | No            |
      | Restrictive orders? (non-molestation, injunction etc.)			   	  | Yes           |
      | Are there any risk management issues for an individual placement?     | No            |
      | Are there any risk management issues if working in a supervised group?| Yes           |
      | Alcohol or drug issues with health and safety impact? 				  | No            |
