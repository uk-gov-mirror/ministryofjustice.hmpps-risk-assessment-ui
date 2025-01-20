Feature: Verify the content on the Pdf Preview page matches the values entered/selected in all the Sections

  As a Probation Practitioner,
  I complete all sections to be actioned and verify that answers on the Pdf Preview page matches the values entered/selected in all the Sections
  So that that I know all the information in the Pdf Preview page sections is correct

  Scenario: Verify the End2End application flow of UPW and verify the content on the pdf previw page
    Given I login and navigate to UPW Task list page with full dataDriven CRN
    And I see the UPW "task-list" page
    And I check the visual regression for "task-list"
    #  Action/Enter Offender's "Individual details"
    When I click on the "Individual's details" link
    And I see UPW "Individual's details" page
    And I verify that "No, I'll come back later" is Default state on Individuals details page
    And I click "Change" link for changing Contact details
    And I see UPW "Contact details" page
    And I check the visual regression for "contact-details"
    Then I enter the details on the "Contact details" page as follows
      | Field Name    | Text to be entered     |
      | Building name | New Offender Building  |
      | House number  | 1                      |
      | Street name   | MAIN Offender's Street |
      | District      | Sheffield              |
      | Town/City     | Sheffield              |
      | County        | South Yorkshire        |
      | Postcode      | S3 1HY                 |
      | Phone number  | 02142785462            |
      | Mobile number | 07123456789            |
      | Email         | test@test.com          |
    And I click the "Save" button on Contact details
    And I see UPW "Individual's details" page
    And I verify the details on the "Individuals details" page as follows
      | Field Name    | Text to be Verified    |
      | Building name | New Offender Building  |
      | House number  | 1                      |
      | Street name   | MAIN Offender's Street |
      | District      | Sheffield              |
      | Town/City     | Sheffield              |
      | County        | South Yorkshire        |
      | Postcode      | S3 1HY                 |
      | Mobile number | 07123456789            |
      | Phone number  | 02142785462            |
      | Email         | test@test.com          |
    And I click "Add contact" button for Emergency contact details
    And I see UPW "Emergency contact" page
    And I check the visual regression for "emergency-contact"
    Then I enter the details on the "Emergency contact details" page as follows
      | Field Name                     | Text to be entered |
      | First name                     | Charles            |
      | Family name                    | Europe             |
      | Relationship to the individual | Friend             |
      | Phone number                   | 02142785462        |
      | Mobile number                  | 020123456789       |
    And I click the "Save" button on Contact details
    And I see UPW "Individual's details" page
    And I verify the "Emergency contact 2" in "Emergency contact details" Section as follows
      | Question name to be verified   | Details to be verified |
      | Name                           | Charles                |
      | Surname                        | Europe                 |
      | Relationship to the individual | Friend                 |
      | Mobile number                  | 020123456789           |
      | Phone number                   | 02142785462            |
    And I check the visual regression for "individuals-details"
    And I click on "Remove" link against the "Emergency Contact 1" on the Individual details
    And I select "Yes" for Mark this section as complete? for Individuals details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Individual's details" link is marked as "Completed"
    #  Action/Enter Offender's "Gender information"
    When I click on the "Gender information" link
    And I see UPW "Gender information" page
    And I check the visual regression for "gender-information"
    And I see that "No, I'll come back later" is Default state on Gender information page
    And I select the Options and enter the details on the "Gender information" page as follows
      | Question Name                                                                                                                                                   | Select Option | Text to be entered in Give Details  |
      | Gender identity                                                                                                                                                 | Female        |                                     |
      | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? | Yes           | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)?                                                                            | Yes           |                                     |
      | Do they consider themselves to be transgender or have a transgender history?                                                                                    | Yes           |                                     |
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Gender information" link is marked as "Completed"
    And I see that "Placement preferences" link is available
    #  Action/Enter Offender's "Cultural and religious adjustments"
    When I click on the "Cultural and religious adjustments" link
    And I see UPW "Are adjustments required for cultural or religious reasons?" page
    And I check the visual regression for "cultural-religious-adjustments"
    And I verify that "No, I'll come back later" is Default state on Cultural and religious page
    And I select the "Yes" radio Button for culture and religious adjustments
    And I enter details for culture and religious adjustments as "Test Culture details"
    And I select "Yes" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "Completed"
    #  Action/Enter Offender's "Placement preferences"
    When I click on the "Placement preferences" link
    And I see UPW "Does the individual have any placement preferences?" page
    And I check the visual regression for "placement-preferences"
    And I verify that "No, I'll come back later" is Default state on Placement preferences page
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "Individual"
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Placement preferences" link is marked as "Completed"
    #  Action/Enter Offender's "Risk of harm in the community" information
    When I click on the "Risk of harm in the community" link
    And I see UPW "Risk of harm in the community" page
    And I check the visual regression for "risk-of-harm-in-the-community"
    And I see "Risk of harm in the community" in page title
    And I verify that "No, I'll come back later" is Default state on Risk of harm in the community page
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
    And I select "Yes" for Mark this section as complete? for Risk of Harm Community
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Risk of harm in the community" link is marked as "Completed"
    #  Action/Enter Offender's "Managing risk" details
    When I click on the "Managing risk" link
    And I see UPW "Managing risk" page
    And I check the visual regression for "managing-risk"
    And I see that "No, I'll come back later" is Default state on Managing risk page
    And I select the Options and enter the details on the "Managing Risk" page as follows
      | Question Name                                                          | Select Option | Text to be entered in Give Details                 |
      | Location restricted by victim exclusion criteria?                      | Yes           | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                 | Yes           | Entering Text related to restricted placement      |
      | Recommend not to place with female supervisor?                         | Yes           | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                           | Yes           | Entering Text related to male supervisor           |
      | Restrictive orders? (non-molestation, injunction etc.)                 | Yes           | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?      | Yes           | Entering Text related to individual placement      |
      | Are there any risk management issues if working in a supervised group? | Yes           | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact?                  | Yes           | Entering Text related to health and safety impact  |
    And I select "Yes" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Managing risk" link is marked as "Completed"
    #  Action/Enter Offender's "Disabilities and mental health" details
    When I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    And I check the visual regression for "disabilities-and-mental-health"
    And I see that "No, I'll come back later" is Default state on Disabilities and mental health page
    And I select the Options and enter the details on the "Disabilities and mental health" page as follows
      | Question Name                                                                                                      | Select Option | Text to be entered in Give Details                 |
      | Any additional disabilities or health issues that affect the individuals ability to engage with Community Payback? | Yes           | Entering Text related to the Additional disability |
      | Do any one of the above affect the individual's ability to engage with Community Payback?                          | No            | Entering Text related to the disability            |
    And I select "Yes" for Mark this section as complete? for Disabilities and mental health
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Disabilities and mental health" link is marked as "Completed"
    #  Action/Enter Offender's existing "Health issues"
    When I click on the "Health issues" link
    And I see UPW "Are there any other health issues that may affect ability to work?" page
    And I check the visual regression for "other-health-issues"
    And I see that "No, I’ll come back later" is Default state on Health issues page
    And I select the Options and enter the details on the "Health issues" page as follows
      | Question Name                                                | Select Option | Text to be entered in Give Details                    |
      | Does the individual have any known allergies?                | Yes           | Entering Text related to Allergies                    |
      | Has the individual experienced sudden loss of consciousness? | Yes           | Entering Text related to Sudden loss of consciousness |
      | Does the individual have epilepsy?                           | Yes           | Entering Text related to Epilepsy                     |
      | Is the individual pregnant or recently given birth?          | Pregnant      | Entering Text related to Pregnancy                    |
      | Any other health issues?                                     | Yes           | Entering Text related to Health issues                |
    And I select "Yes" for Mark this section as complete? for Health issues
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Health issues" link is marked as "Completed"
    #  Action/Enter Offender's "GP Details"
    And I see the UPW "task-list" page
    And I click on the "GP Details" link
    When I see UPW "GP Details" page
    And I verify that "No, I'll come back later" is Default state on GP details page
    And I click "Add contact" button for GP details
    And I see UPW "Details of GP" page
    And I check the visual regression for "details-of-gp"
    And I enter the details on the "GP details" page as follows
      | Field Name       | Text to be entered         |
      | Name             | Charles Doctor             |
      | Medical practice | Sheffield Medical practice |
      | Building name    | New Offender Building      |
      | House number     | 1                          |
      | Street name      | MAIN Offender's Street     |
      | District         | Sheffield                  |
      | Town/City        | Sheffield                  |
      | County           | South Yorkshire            |
      | Postcode         | S3 1HY                     |
      | Phone number     | 02142785462                |
    And I click the "Save" button on GP details
    And I see UPW "GP Details" page
    And I verify the GP contact details "3" on the GP details page as follows
      | Field Name       | Text to be Verified        |
      | Name             | Charles Doctor             |
      | Practice name    | Sheffield Medical practice |
      | Address          | New Offender Building      |
      | Address          | 1 MAIN Offender's Street   |
      | Address          | Sheffield                  |
      | Address          | Sheffield                  |
      | Address          | South Yorkshire            |
      | Address          | S3 1HY                     |
      | Phone number     | 02142785462                |
    And I check the visual regression for "gp-details"
    And I select "Yes" for Mark this section as complete? for GP details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "GP Details" link is marked as "Completed"
    #  Action/Enter Offender's "Travel" information
    When I click on the "Travel" link
    And I see UPW "Travel information" page
    And I check the visual regression for "travel-information"
    And I see that "No, I'll come back later" is Default state on Travel information page
    And I select the Options and enter the details on the "Travel information" page as follows
      | Question Name                                                                | Select Option | Text to be entered in Give Details         |
      | Does the individual have any travel issues that will affect their placement? | Yes           | Entering Text related to the Travel Issues |
      | Does the individual have a valid driving licence?                            | Yes           |                                            |
      | Do they have access to a vehicle?                                            | Yes           |                                            |
      | Is public transport available and accessible to the individual?              | Yes           |                                            |
    And I select "Yes" for Mark this section as complete? for Travel information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Travel" link is marked as "Completed"
    #  Action/Enter Offender's "Caring commitments" details
    When I click on the "Caring commitments" link
    And I see UPW "Are there carer commitments?" page
    And I check the visual regression for "carer-commitments"
    And I see that "No, I'll come back later" is Default state on Caring commitments page
    And I enter Additional information as "Additional caring commitments" for Caring commitments
    And I select "Yes" for Mark this section as complete? for Caring commitments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Caring commitments" link is marked as "Completed"
    #  Action/Enter Offender's "Employment, education and skills" information
    And I click on the "Employment, education and skills" link
    When I see UPW "Employment, education and skills" page
    And I check the visual regression for "employment-education-and-skills"
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
    Then I see the "Employment, education and skills" link is marked as "Completed"
    #  Action/Enter Offender's "Training & employment opportunities" information
    And I click on the "Training & employment opportunities" link
    When I see UPW "Training & employment opportunities" page
    And I check the visual regression for "training-and-employment-opportunities"
    And I see that "No, I'll come back later" is Default state on Training & employment page
    And I select the Options and enter the details on the "Training & employment" page as follows
      | Question Name                                                                             | Select Option | Text to be entered in Give Details                                           |
      | Does the individual have an education, training or employment-related need?               | Yes           | Entering Text related to the training needs                                  |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | No            | Entering Text related to maximum entitlement of their hours on this activity |
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Training & employment opportunities" link is marked as "Completed"
    #  Action/Enter Offender's "Intensive working" details
    When I click on the "Intensive working" link
    And I see UPW "Intensive working" page
    And I check the visual regression for "intensive-working"
    And I see that "No, I'll come back later" is Default state on Intensive working page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I enter the details on the "Intensive working" page as follows
      | Question Name                                                                             | Text to be entered in Details                 |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 0                                             |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "Completed"
    #  Action/Enter Offender's "Availability" for Community Payback work
    When I click on the "Availability" link
    And I see UPW "Availability for Community Payback work" page
    And I check the visual regression for "availability-for-community-payback-work"
    And I see that "No, I'll come back later" is Default state on Availability page
    And I select the Availability CheckBoxes as follows
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I enter "Available early mornings and late nights" in the Additional availability information
    And I select "Yes" for Mark this section as complete? for Availability
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Availability" link is marked as "Completed"
    #  Action/Enter Offender's "Equipment" requirements
    When I click on the "Choose equipment sizes" link
    And I see UPW "Choose equipment sizes" page
    And I check the visual regression for "choose-equipment-sizes"
    And I see "Choose equipment sizes" in page title
    And I verify that "No, I'll come back later" is Default state on Equipment page
    And I select the Options and enter the details on the "Equipment" page as follows
      | Question Name                     | Select Option |
      | Male or female clothing required? | Male          |
      | Waterproof clothing               | Large         |
      | Footwear                          | Size 10       |
    And I select "Yes" for Mark this section as complete? for Equipment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Completed"
    #   PDF preview, confirm declaration & generate output pdf
    And I check the visual regression for "task-list-complete"
    And I click on the "Completed assessment" link
    And I see output "pdf-preview" Page
    And I verify the "Offence details" Section for offence and dates on the pdf-preview page as follows
      | Question name to be verified | Details to be verified |
      | Offence                      | 056 - Arson            |
      | Subcode                      | 00 - Arson             |
      | Sentence date                | 7th January 2021       |
    And I verify the "Personal details" Section for personal info on the pdf-preview page as follows
      | Question name to be verified | Details to be verified |
      | Family name                  | Whitfield              |
      | First name                   | Sam                    |
      | Date of birth                | 2nd September 1949     |
      | CRN                          |                        |
    And I verify the "Gender information" Section for gender details on the pdf-preview page as follows
      | Question name to be verified                                                                                                                                    | Details to be verified              |
      | Gender identity                                                                                                                                                 | Female                              |
      | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? | Yes                                 |
      | Give details and discuss placement options with the individual, based on their gender identity.                                                                 | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)?                                                                            | Yes                                 |
      | Do they consider themselves to be transgender or have a transgender history?                                                                                    | Yes                                 |
    And I verify the "Contact details" Section for contact info on the pdf-preview page as follows
      | Question name to be verified | Details to be verified   |
      | Address                      | New Offender Building    |
      |                              | 1 MAIN Offender's Street |
      |                              | Sheffield                |
      |                              | Sheffield                |
      |                              | South Yorkshire          |
      |                              | S3 1HY                   |
      | Mobile                       | 07123456789              |
      | Phone number                 | 02142785462              |
      | Email                        | test@test.com            |
    And I verify the "Emergency contact 1" in "Emergency contact details" Section as follows on the PDF Preview page
      | Question name to be verified | Details to be verified |
      | Name                         | Charles                |
      | Surname                      | Europe                 |
      | Relationship to individual   | Friend                 |
      | Mobile                       | 020123456789           |
      | Phone number                 | 02142785462            |
    And I verify the "Risk of harm in the community" Section for rosh info on the pdf-preview page as follows
      | Question name to be verified                                                            | Option to be verified | Text to be verified                              |
      | History of sexual offending?                                                            | Yes                   | Entering Text related to sexual offending        |
      | Individual poses a risk to children?                                                    | Yes                   | Entering Text related to risk to children        |
      | Violent offences?                                                                       | Yes                   | Entering Text related to Violent offences        |
      | History of acquisitive offending?                                                       | Yes                   | Entering Text related to acquisitive offending   |
      | Has the individual been involved in serious group offending (SGO)?                      | Yes                   | Entering Text related to serious group offending |
      | Control issues or disruptive behaviour?                                                 | Yes                   | Entering Text related to disruptive behaviour    |
      | History of hate-based attitudes or behaviours?                                          | Yes                   | Entering Text related to hate-based attitudes    |
      | For example, homophobic or racially motivated                                           | Yes                   |                                                  |
      | Is the individual vulnerable because they are a high-profile person?                    | Yes                   | Entering Text related to high-profile person     |
      | For example, they are prominent on social media or are well-known in a particular area. | Yes                   |                                                  |
      | Additional risk assessment information?                                                 | Yes                   | Entering Text related to Additional information  |
    And I verify the "Management of risk" Section for risk management info on the pdf-preview page as follows
      | Question name to be verified                                           | Option to be verified | Text to be verified                                |
      | MAPPA nominal?                                                         | No                    |                                                    |
      | Location restricted by victim exclusion criteria?                      | Yes                   | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                 | Yes                   | Entering Text related to restricted placement      |
      | Recommend not to place with female supervisor?                         | Yes                   | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                           | Yes                   | Entering Text related to male supervisor           |
      | Restrictive orders?                                                    | Yes                   | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?      | Yes                   | Entering Text related to individual placement      |
      | Are there any risk management issues if working in a supervised group? | Yes                   | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact?                  | Yes                   | Entering Text related to health and safety impact  |
    And I verify the "Diversity information" Section for diversity info on the pdf-preview page as follows
      | Question name to be verified                                | Option to be verified | Text to be verified  |
      | Preferred language                                          |                       |                      |
      | Interpreter required?                                       | No                    |                      |
      | Are adjustments required for cultural or religious reasons? | Yes                   | Test Culture details |
      | Does the individual have any placement preferences?         | Individual            |                      |
# TODO:    And I verify the "Placement restrictions due to health and other needs" disabilities Section for "Disabilities and mental health"
#      | Question name to be verified             | Comments to be verified                                                                                                                              | Adjustments                           |
#      | Disabilities, conditions and adjustments |                                                                                                                                                      |                                       |
#      | Reduced mobility                         | Comment added by Probation User on 19/07/2022 at 13:23 Reduced Mobility addition - Regression Test Automation Suite - ARN-1057 & ARN-1042            | None                                  |
#      | Disfigurement                            | Comment added by Probation User on 19/07/2022 at 13:20 Severe Disfigurement addition - Regression Test Automation Suite - ARN-1057 & ARN-1042        | Other                                 |
#      | Speech condition                         | Comment added by Probation User on 19/07/2022 at 13:26 Speech Impairment addition - Regression Test Automation Suite - ARN-1057 & ARN-1042           | Sign language interpreter/Lip speaker |
#      | Reduced physical ability                 | Comment added by Probation User on 19/07/2022 at 13:25 Reduced Physical Capability addition - Regression Test Automation Suite - ARN-1057 & ARN-1042 | Modified Equipment                    |
#      | Mental health condition                  | Comment added by Probation User on 19/07/2022 at 13:23 Mental illness addition - Regression Test Automation Suite - ARN-1057 & ARN-1042              | Behavioural responses/Body language   |
#      | Apathy                                   | Comment added by Probation User on 19/07/2022 at 13:22 Terminal Apathy addition - Regression Test Automation Suite - ARN-1057 & ARN-1042             | None                                  |
    And I verify the "Placement restrictions due to health and other needs" disabilities Section for "Questions"
      | Question name to be verified                                                                                        | Option to be verified | Text to be verified                                |
      | Any additional disabilities or health issues that affect the individual's ability to engage with Community Payback? | Yes                   | Entering Text related to the Additional disability |
      | Do any of the above affect the individual's ability to engage with Community Payback?                               | No                    |                                                    |
      | Suggest adjustments, if known                                                                                       |                       |                                                    |
    And I verify the "Are there any other health issues that may affect ability to work?" health issues Section
      | Question name to be verified                                 | Option to be verified | Text to be verified                                   |
      | Does the individual have any known allergies?                | Yes                   | Entering Text related to Allergies                    |
      | Has the individual experienced sudden loss of consciousness? | Yes                   | Entering Text related to Sudden loss of consciousness |
      | Does the individual have epilepsy?                           | Yes                   | Entering Text related to Epilepsy                     |
      | Is the individual pregnant or recently given birth?          | Pregnant              | Entering Text related to Pregnancy                    |
      | Any other health issues?                                     | Yes                   | Entering Text related to Health issues                |
    And I verify the GP contact "1" in GP Contact Section as follows
      | Question name to be verified    | Details to be verified |
      | Name                            | Marie CurieContactOne  |
      | GP practice name                |                        |
      | Address                         | 1 Address 1 street     |
      | Address                         | Sheffield              |
      | Address                         | South Yorkshire        |
      | Address                         | S3 1HY                 |
      | Phone number                    | 111111111111           |
    And I verify the GP contact "2" in GP Contact Section as follows
      | Question name to be verified    | Details to be verified |
      | Name                            | Viktor JonesContactTwo |
      | GP practice name                |                        |
      | Address                         | 1 Address 2 street     |
      | Address                         | Sheffield              |
      | Address                         | South Yorkshire        |
      | Address                         | S3 1HY                 |
      | Phone number                    | 22222222222222         |
    And I verify the GP contact "3" in GP Contact Section as follows
      | Question name to be verified    | Details to be verified     |
      | Name                            | Charles Doctor             |
      | GP practice name                | Sheffield Medical practice |
      | Address                         | New Offender Building      |
      | Address                         | 1 MAIN Offender's Street   |
      | Address                         | Sheffield                  |
      | Address                         | Sheffield                  |
      | Address                         | South Yorkshire            |
      | Address                         | S3 1HY                     |
      | Phone number                    | 02142785462                |
    And I verify the "Travel information" travel issues Section
      | Question name to be verified                                                 | Option to be verified | Text to be verified                        |
      | Does the individual have any travel issues that will affect their placement? | Yes                   | Entering Text related to the Travel Issues |
      | Does the individual have a valid driving licence?                            | Yes                   |                                            |
      | Do they have access to a vehicle?                                            | Yes                   |                                            |
      | Is public transport available and accessible to the individual?              | Yes                   |                                            |
    And I verify the "Are there carer commitments?" Section for carer details
      | Question name to be verified | Answer to be verified         |
      | Carer commitments            | Has Dependents                |
      | Additional information       | Additional caring commitments |
    And I verify the "Employment, Education and skills" EESkills Section
      | Question name to be verified                                                                                    | Option to be verified             | Text to be verified                           |
      | Employment or education?                                                                                        | Full-time education or employment |                                               |
      | Employment or education details (working days, hours etc)                                                       |                                   | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading or writing?                                              | Yes                               | Entering Text related to writing difficulties |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               | Entering Text related to future work plans    |
      | For example: retail, gardening etc                                                                              |                                   |                                               |
    And I verify the "Training & Employment Opportunities" training Section
      | Question name to be verified                                                              | Option to be verified | Text to be verified                                                          |
      | Does the individual have an education, training or employment-related need?               | Yes                   | Entering Text related to the training needs                                  |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | No                    | Entering Text related to maximum entitlement of their hours on this activity |
    And I verify the "Availability for Community Payback" availability Section
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I verify the Additional availability information Section
      | Question name to be verified        | Answer to be verified                    |
      | Additional availability information | Available early mornings and late nights |
    And I verify the "Equipment" clothing and footwear Section
      | Question name to be verified      | Option to be verified |
      | Male or female clothing required? | Male                  |
      | Waterproof clothing size          | Large                 |
      | Footwear size (UK)                | Size 10               |
    And I check the visual regression for "pdf-preview"
    And I click on back link
    And I click on Submit Button
    And I see the "You have completed the Community Payback assessment" page
    And I check the visual regression for "assessment-complete"
    # And I download the UPW output pdf
    # TODO: check PDF in S3

#  Scenario: Verify the values are correctly cloned for a cloned assessment
    Given I login and navigate to UPW Task list page for cloned assessment
    And I see the UPW "task-list" page
    When I click on the "Individual's details" link
    And I see UPW "Individual's details" page
    And I verify that "No, I'll come back later" is Default state on Individuals details page
    And I verify the "Contact details" Section for contact info as follows
      | Question name to be verified | Details to be verified |
      | Address                      | 99 Oxford Road         |
      |                              | Epsom                  |
      |                              | Surrey                 |
      |                              | SW16 1AF               |
      | Mobile                       | 07123456789            |
      | Phone number                 | 02142785462            |
      | Email                        | test@test.com          |
    And I verify the "Emergency contact 1" in "Emergency contact details" Section as follows
      | Question name to be verified | Details to be verified |
      | Name                         | JackFutureEndDate      |
      | Surname                      | JonesFutureEndDate     |
      | Relationship to individual   | Father                 |
      | Mobile                       | 0776 666 6666          |
      | Phone number                 |                        |
    And I select "Yes" for Mark this section as complete? for Individuals details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    And I see the "Individual's details" link is marked as "Completed"
    When I click on the "Gender information" link
    And I see UPW "Gender information" page
    And I see that "No, I'll come back later" is Default state on Gender information page
    And I select the Gender Option as "Male"
    And I select "No" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    When I click on the "Gender information" link
    And I see UPW "Gender information" page
    And I verify the Gender information page for cloned assessment as follows
      | Question Name                                                                                                                                                   | Option to be verified | Details to be verified              |
      | Gender identity                                                                                                                                                 | Male                  |                                     |
      | Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? | Yes                   | Entering Text related to sex change |
      | Is the individual intersex or do they have a Difference in Sexual Development (DSD)?                                                                            | Yes                   |                                     |
      | Do they consider themselves to be transgender or have a transgender history?                                                                                    | Yes                   |                                     |
    And I select the Gender Option as "Female"
    And I select "Yes" for Mark this section as complete? for Gender information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Gender information" link is marked as "Completed"
    And I see that "Placement preferences" link is available
    When I click on the "Cultural and religious adjustments" link
    And I see UPW "Are adjustments required for cultural or religious reasons?" page
    #  And I verify that "No, I'll come back later" is Default state on Cultural and religious page
    And I select the "Yes" radio Button for culture and religious adjustments
    And I verify the Cultural or religious page for cloned assessment as follows
      | Question Name                                               | Option to be verified | Details to be verified |
      | Are adjustments required for cultural or religious reasons? | Yes                   | Test Culture details   |
    And I select "Yes" for Mark this section as complete? for Culture And Religious Adjustments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Cultural and religious adjustments" link is marked as "Completed"
    #  Action/Enter Offender's "Placement preferences"
    When I click on the "Placement preferences" link
    And I see UPW "Does the individual have any placement preferences?" page
#    #  And I verify that "No, I'll come back later" is Default state on Placement preferences page
    And I verify the Placement preferences page for cloned assessment as follows
      | Question Name                                       | Option to be verified              |
      | Does the individual have any placement preferences? | Both Yes&No should not be selected |
    And I select the "Yes" radio Button for placement preferences
    And I say my placement preference is "Individual"
    And I select "Yes" for Mark this section as complete?
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Placement preferences" link is marked as "Completed"
    #  Action/Enter Offender's "Risk of harm in the community" information
    When I click on the "Risk of harm in the community" link
    And I see UPW "Risk of harm in the community" page
    And I see "Risk of harm in the community" in page title
    And I verify that "No, I'll come back later" is Default state on Risk of harm in the community page
    And I verify the Risk of harm in the community page for cloned assessment as follows
      | Question Name                                                         | Option to be verified | Text to be verified in Give Details              |
      | History of sexual offending?                                          | Yes                   | Entering Text related to sexual offending        |
      | Individual poses a risk to children?                                  | Yes                   | Entering Text related to risk to children        |
      | Violent offences?                                                     | Yes                   | Entering Text related to Violent offences        |
      | History of acquisitive offending?                                     | Yes                   | Entering Text related to acquisitive offending   |
      | Has the individual been involved in serious group offending (SGO)?    | Yes                   | Entering Text related to serious group offending |
      | Control issues or disruptive behaviour?                               | Yes                   | Entering Text related to disruptive behaviour    |
      | History of hate-based attitudes or behaviours?                        | Yes                   | Entering Text related to hate-based attitudes    |
      | Is the individual vulnerable because they are a high-profile person?  | Yes                   | Entering Text related to high-profile person     |
      | Additional risk assessment information relevant to Community Payback? | Yes                   | Entering Text related to Additional information  |
    And I select "Yes" for Mark this section as complete? for Risk of Harm Community
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Risk of harm in the community" link is marked as "Completed"
#      Action/Enter Offender's "Managing risk" details
    When I click on the "Managing risk" link
    And I see UPW "Managing risk" page
    And I see that "No, I'll come back later" is Default state on Managing risk page
    And I verify the Managing risk page for cloned assessment as follows
      | Question Name                                                          | Option to be verified | Text to be verified in Give Details                |
      | Location restricted by victim exclusion criteria?                      | Yes                   | Entering Text related to victim exclusion criteria |
      | Close supervision or restricted placement recommended?                 | Yes                   | Entering Text related to restricted placement      |
      | Recommend not to place with female supervisor?                         | Yes                   | Entering Text related to female supervisor         |
      | Recommend not to place with male supervisor?                           | Yes                   | Entering Text related to male supervisor           |
      | Restrictive orders? (non-molestation, injunction etc.)                 | Yes                   | Entering Text related to Restrictive orders        |
      | Are there any risk management issues for an individual placement?      | Yes                   | Entering Text related to individual placement      |
      | Are there any risk management issues if working in a supervised group? | Yes                   | Entering Text related to supervised group          |
      | Alcohol or drug issues with health and safety impact?                  | Yes                   | Entering Text related to health and safety impact  |
    And I select "Yes" for Mark this section as complete? for Managing Risk
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Managing risk" link is marked as "Completed"
    #  Action/Enter Offender's "Disabilities and mental health" details
    When I click on the "Disabilities and mental health" link
    And I see UPW "Disabilities and mental health" page
    And I see that "No, I'll come back later" is Default state on Disabilities and mental health page
    And I verify the Disabilities and mental health page for cloned assessment as follows
      | Question Name                                                                                                      | Option to be verified | Text to be verified in Give Details                |
      | Any additional disabilities or health issues that affect the individuals ability to engage with Community Payback? | Yes                   | Entering Text related to the Additional disability |
      | Do any one of the above affect the individual's ability to engage with Community Payback?                          | No                    | Entering Text related to the disability            |
    And I select "Yes" for Mark this section as complete? for Disabilities and mental health
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Disabilities and mental health" link is marked as "Completed"
    #  Action/Enter Offender's existing "Health issues"
    When I click on the "Health issues" link
    And I see UPW "Are there any other health issues that may affect ability to work?" page
    And I see that "No, I’ll come back later" is Default state on Health issues page
    And I verify the Health issues page for cloned assessment as follows
      | Question Name                                                | Option to be verified | Text to be verified in Give Details                   |
      | Does the individual have any known allergies?                | Yes                   | Entering Text related to Allergies                    |
      | Has the individual experienced sudden loss of consciousness? | Yes                   | Entering Text related to Sudden loss of consciousness |
      | Does the individual have epilepsy?                           | Yes                   | Entering Text related to Epilepsy                     |
      | Is the individual pregnant or recently given birth?          | Pregnant              | Entering Text related to Pregnancy                    |
      | Any other health issues?                                     | Yes                   | Entering Text related to Health issues                |
    And I select "Yes" for Mark this section as complete? for Health issues
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Health issues" link is marked as "Completed"
    #  Action/Enter Offender's "GP Details"
    And I see the UPW "task-list" page
    And I click on the "GP Details" link
    When I see UPW "GP Details" page
    And I verify that "No, I'll come back later" is Default state on GP details page
    And I verify the GP contact details "1" on the GP details page as follows
      | Field Name       | Text to be Verified   |
      | Name             | Marie CurieContactOne |
      | Practice name    |                       |
      | Address          | 1 Address 1 street    |
      | Address          | Sheffield             |
      | Address          | South Yorkshire       |
      | Address          | S3 1HY                |
      | Phone number     | 111111111111          |
    And I verify the GP contact details "2" on the GP details page as follows
      | Field Name       | Text to be Verified    |
      | Name             | Viktor JonesContactTwo |
      | Practice name    |                        |
      | Address          | 1 Address 2 street     |
      | Address          | Sheffield              |
      | Address          | South Yorkshire        |
      | Address          | S3 1HY                 |
      | Phone number     | 22222222222222         |
    And I select "Yes" for Mark this section as complete? for GP details
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "GP Details" link is marked as "Completed"
    #  Action/Enter Offender's "Travel" information
    When I click on the "Travel" link
    And I see UPW "Travel information" page
#    And I see that "No, I'll come back later" is Default state on Travel information page
    And I verify the Travel information page for cloned assessment as follows
      | Question Name                                                                | Option to be verified | Text to be verified in Give Details        |
      | Does the individual have any travel issues that will affect their placement? | Yes                   | Entering Text related to the Travel Issues |
      | Does the individual have a valid driving licence?                            | Yes                   |                                            |
      | Do they have access to a vehicle?                                            | Yes                   |                                            |
      | Is public transport available and accessible to the individual?              | Yes                   |                                            |
    And I select "Yes" for Mark this section as complete? for Travel information
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Travel" link is marked as "Completed"
    #  Action/Enter Offender's "Caring commitments" details
    When I click on the "Caring commitments" link
    And I see UPW "Are there carer commitments?" page
    And I see that "No, I'll come back later" is Default state on Caring commitments page
    And I verify the Caring commitments page for cloned assessment as follows
      | Field Name                        | Text to be verified           |
      | Carer commitments                 | Has Dependents                |
      | Additional information (Optional) | Additional caring commitments |
    And I select "Yes" for Mark this section as complete? for Caring commitments
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Caring commitments" link is marked as "Completed"
    #  Action/Enter Offender's "Employment, education and skills" information
    And I click on the "Employment, education and skills" link
    When I see UPW "Employment, education and skills" page
    And I see "Employment, education and skills" in page title
#    And I verify that "No, I'll come back later" is Default state on Employment, education and skills page
    And I verify the Employment, education and skills page for cloned assessment as follows
      | Question Name                                                                                                   | Option to be verified             | Text to be verified in Give Details           |
      | Is the individual in employment or education?                                                                   | Full-time education or employment | Entering Text related to Full-time education  |
      | Does the individual have any difficulties with reading, writing or numbers?                                     | Yes                               | Comment added by Probation User on 01/09/2022 at 14:03 |
      | Does the individual have any work skills or experience that could be used while carrying out Community Payback? | Yes                               | Entering Text related to work skills          |
      | Does the individual have future work plans that could be supported through a Community Payback placement?       | Yes                               | Entering Text related to future work plans    |
    And I select "Yes" for Mark this section as complete? for Employment, education and skills
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Employment, education and skills" link is marked as "Completed"
    #  Action/Enter Offender's "Training & employment opportunities" information
    And I click on the "Training & employment opportunities" link
    When I see UPW "Training & employment opportunities" page
#    And I see that "No, I'll come back later" is Default state on Training & employment page
    And I verify the Training & employment page for cloned assessment as follows
      | Question Name                                                                             | Option to be verified | Text to be verified in Give Details                                          |
      | Does the individual have an education, training or employment-related need?               | Yes                   | Entering Text related to the training needs                                  |
      | Does the individual agree to use the maximum entitlement of their hours on this activity? | No                    | Entering Text related to maximum entitlement of their hours on this activity |
    And I select "Yes" for Mark this section as complete? for Training & employment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Training & employment opportunities" link is marked as "Completed"
    #  Action/Enter Offender's "Intensive working" details
    When I click on the "Intensive working" link
    And I see UPW "Intensive working" page
    And I see that "No, I'll come back later" is Default state on Intensive working page
    And I select "Yes" for "Is the individual eligible for intensive working?" Intensive working question
    And I verify the Intensive working page Yes option for cloned assessment as follows
      | Question Name                                                                             | Text to be verified                           |
      | Recommended hours per week in addition to statutory minimum, at the start of the order    | 21                                            |
      | Recommended hours per week in addition to statutory minimum, at the midpoint of the order | 0                                             |
      | At what point should the individual be expected to reach a 28-hour working week?          | Entering Text related to 28-hour working week |
      | Is the individual eligible for intensive working?-No-Give detail                          | Entering Text related to Not eligibility      |
    And I select "Yes" for Mark this section as complete? for Intensive working
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Intensive working" link is marked as "Completed"
    #  Action/Enter Offender's "Availability" for Community Payback work
    When I click on the "Availability" link
    And I see UPW "Availability for Community Payback work" page
#    #  And I see that "No, I'll come back later" is Default state on Availability page
    And I verify the Availability Section as follows
      | Availability | Monday      | Tuesday       | Wednesday   | Thursday      | Friday      | Saturday      | Sunday      |
      | Morning      | Morning-Yes |               |             |               | Morning-Yes |               |             |
      | Afternoon    |             | Afternoon-Yes |             | Afternoon-Yes |             | Afternoon-Yes |             |
      | Evening      |             |               | Evening-Yes |               |             |               | Evening-Yes |
    And I verify the text "Available early mornings and late nights" in the Additional availability information
    And I select "Yes" for Mark this section as complete? for Availability
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Availability" link is marked as "Completed"
    #  Action/Enter Offender's "Equipment" requirements
    When I click on the "Choose equipment sizes" link
    And I see UPW "Choose equipment sizes" page
    And I see "Choose equipment sizes" in page title
    And I verify that "No, I'll come back later" is Default state on Equipment page
    And I verify the details on the "Equipment" page for cloned assessment as follows
      | Question Name                     | Select Option |
      | Male or female clothing required? | Male          |
      | Waterproof clothing               | Large         |
      | Footwear                          | Size 10       |
    And I select "Yes" for Mark this section as complete? for Equipment
    And I click on the "Save" button
    And I see the UPW "task-list" page
    Then I see the "Choose equipment sizes" link is marked as "Completed"
    And I click on the "Completed assessment" link
    And I click on back link
    And I click on Submit Button
    And I see the "You have completed the Community Payback assessment" page
#    And I download the UPW output pdf
    # TODO: check PDF in S3
