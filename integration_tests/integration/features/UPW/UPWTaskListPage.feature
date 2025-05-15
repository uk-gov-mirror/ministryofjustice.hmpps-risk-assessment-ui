Feature: Verify the UPW Task List page

  As a Probation Practitioner, when
  I first land on the task list page I will see that all task are set to incomplete
  So that I know that I have all sections still to action and
  I verify that all links are working and taking me to respective pages

  Background: Navigate to "Task list" page
    Given I login and navigate to UPW Task list page with dataDriven CRN

  Scenario: Verify all the links of the UPW Task list page are working
    When I see the UPW "task-list" page
    And I see the page header "Community payback assessment"
    Then I verify the following links are available & working on the "Task List page"
      | Link Name                           | Status     | Page to be displayed on clicking the Link                          |
      #  Individual's details Section
      | Individual's details                | Incomplete | Individual's details                                               |
      # Diversity information Section
      | Gender information                  | Incomplete | Gender information                                                 |
      | Cultural and religious adjustments  | Incomplete | Are adjustments required for cultural or religious reasons?        |
      | Other adjustments                   | Incomplete | Other adjustments                                                  |
      # | Placement preferences               | Incomplete | Does the individual have any placement preferences?                |
      # Risk information Section
      | Risk of harm in the community       | Incomplete | Risk of harm in the community                                      |
      | Managing risk                       | Incomplete | Managing risk                                                      |
      # Placement restrictions due to health and other needs Section                
      | Disabilities and mental health      | Incomplete | Disabilities and mental health                                     |
      | Health issues                       | Incomplete | Are there any other health issues that may affect ability to work? |
      | GP Details                          | Incomplete | GP Details                                                         |
      | Travel                              | Incomplete | Travel information                                                 |
      | Caring commitments                  | Incomplete | Are there carer commitments?                                       |
      # Employment, education and skills information Section
      | Employment, education and skills    | Incomplete | Employment, education and skills                                   |
      | Training & employment opportunities | Incomplete | Training & employment opportunities                                |
      # Placement details Section
      | Intensive working                   | Incomplete | Intensive working                                                  |
      | Availability                        | Incomplete | Availability for Community Payback work                            |
      | Choose equipment sizes              | Incomplete | Choose equipment sizes                                             |
    And I verify the "Preview" Section on the task list page
      | Task list name       | Status              |
      | Completed assessment | Cannot view PDF yet |

  Scenario: Verify that the user is able to navigate back to "Start Page" whilst on the Task List page
    When I see the UPW "task-list" page
    Then I see the page header "Community payback assessment"
    And I click on back link
    And I see the UPW "UPW/start" page
    And I click on the Start button
    And I see the UPW "task-list" page
