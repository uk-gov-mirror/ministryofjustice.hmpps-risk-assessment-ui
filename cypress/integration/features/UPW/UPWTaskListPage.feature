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
      | Individual's details                | INCOMPLETE | Individual's details                                               |
      # Diversity information Section
      | Gender information                  | INCOMPLETE | Gender information                                                 |
      | Cultural and religious adjustments  | INCOMPLETE | Are adjustments required for cultural or religious reasons?        |
      # | Placement preferences               | INCOMPLETE | Does the individual have any placement preferences?                |
      # Risk information Section
      | Risk of harm in the community       | INCOMPLETE | Risk of harm in the community                                      |
      | Managing risk                       | INCOMPLETE | Managing risk                                                      |
      # Placement restrictions due to health and other needs Section
      | Disabilities and mental health      | INCOMPLETE | Disabilities and mental health                                     |
      | Health issues                       | INCOMPLETE | Are there any other health issues that may affect ability to work? |
      | GP Details                          | INCOMPLETE | GP Details                                                         |
      | Travel                              | INCOMPLETE | Travel information                                                 |
      | Caring commitments                  | INCOMPLETE | Are there carer commitments?                                       |
      # Employment, education and skills information Section
      | Employment, education and skills    | INCOMPLETE | Employment, education and skills                                   |
      | Training & employment opportunities | INCOMPLETE | Training & employment opportunities                                |
      # Placement details Section
      | Intensive working                   | INCOMPLETE | Intensive working                                                  |
      | Availability                        | INCOMPLETE | Availability for Community Payback work                            |
      | Choose equipment sizes              | INCOMPLETE | Choose equipment sizes                                             |
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
