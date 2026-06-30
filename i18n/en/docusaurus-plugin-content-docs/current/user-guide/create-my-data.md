---
sidebar_position: 4
title: Create My Data
description: Follow the Prepare → Build → Data validation flow to create processes, models, flows, and supporting references in “My Data”.
---

Within “My Data” you control the full lifecycle of TianGong LCA datasets. This guide breaks the work into three stages—**Preparation → Build datasets → Data validation & publish**—to minimise rework and keep references consistent.

## Before you start

### Common rules

1. **Language fields**: Whenever a field offers multiple languages, the English input is mandatory. Match the language selector to the content you enter.  
   ![](./img/language.png)
2. **Selection panels**: For fields such as “Dataset format” or “Compliance system name”:  
   - Click the “Select” button next to the field.  
   - Use the tabs to switch categories.  
   - Tick the desired row (highlighted in purple).  
   - To reference a historical version, open **All Versions** for that row, select the version, then save.  
   - Click “Save” to confirm and exit the panel.  
   ![](./img/choose.png)
3. **Versioning**: Fill in the version number first and save a draft. Continue editing afterwards and save frequently to prevent data loss.

### Recommended preparation order

To ensure every reference exists when you start modelling, prepare these items first:

1. **Contacts**: Identify responsible people and their email addresses.  
2. **Sources**: Gather literature, reports, or survey materials; upload any supporting files.  
3. **Unit groups & flow properties**: Reuse standard definitions whenever possible. Only create new ones after team review.  
4. **Flows**: Define flows with the correct unit groups and properties so that processes can reference them immediately.

Once the groundwork is complete, move on to processes and models.

## Build datasets

### Create a process {#create-process}

1. Open **My Data → Processes** and click `+`.  
2. Complete the “Process information”, “Modelling information”, and “Management information” sections.  
   ![](./img/process1.png) ![](./img/process2.png)
3. Switch to **Inputs & Outputs** to add flows:  
   - Click `+` to reference an existing flow or create a new one (see [Create a flow](#create-flow)).  
   - Enter the quantity and unit; perform conversions if needed.  
   - Save and repeat until all flows are listed.  
   ![](./img/process3.png)
4. Designate the main output as the **Reference flow** and save.  
5. Click **Save** at the bottom to store the process configuration.  
   ![](./img/process4.png)

### Create a model {#create-model}

1. Open **My Data → Models** and click `+`.  
2. Use the node selector to add the processes that belong to the model.  
   ![](./img/model1.png) ![](./img/model2.png)
3. For each node, open **Inputs/Outputs** and connect the required flows.  
4. Arrange the nodes, set the reference process, and specify the reference flow quantity.  
   ![](./img/model3.png) ![](./img/model4.png)
5. Complete “Model information”, “Modelling & validation”, and “Management information”.  
   ![](./img/model5.png)
6. Review the **Model results** panel, then save.  
   ![](./img/model6.png)

> Models composed of multiple unit processes can be reused as processes. After saving, they appear in both “Models” and “Processes”.

### Create a flow {#create-flow}

1. Open **My Data → Flows** and click `+`.  
   ![](./img/flow1.png)
2. Fill in “Flow information”, “Modelling & validation”, and “Management information”.  
   ![](./img/flow2.png)
3. Under **Flow properties**, click `+` to select or create properties, then provide the values and quantity settings.  
4. Save the flow.  
   ![](./img/flow3.png)

### Create a contact {#create-contact}

1. Open **My Data → Contacts** and click `+`.  
2. Provide names, emails, and optional organisation details (link to an existing team if needed).  
3. Save so the contact can be referenced elsewhere.

### Create a source {#create-source}

1. Open **My Data → Sources** and click `+`.  
2. Fill in authors, title, publication details, year, and DOI/URL.  
3. Upload attachments under “Electronic document link” if applicable, then save.  

> Citations should follow standard academic formats. Example:  
> `Liu J., Zhao J., Wei H., et al., Comparative environmental assessment of methanol production technologies: A cradle-to-gate life cycle analysis. Energy Conversion and Management, 2024, 302:118128.`

## Unit groups & flow properties (advanced)

Custom unit groups or flow properties can introduce conversion issues or LCIA failures. Use them only when absolutely necessary.

### Create a unit group

1. Open **My Data → Unit groups** and click `+`.  
2. Fill in “Unit group information”, “Modelling & validation”, and “Management information”.  
3. Under **Units**, add each unit, define conversion factors, and mark the reference unit (e.g. `kg` in a mass group).  
   ![](./img/unitgroup.png)

### Create a flow property

1. Open **My Data → Flow properties** and click `+`.  
2. Complete “Flow property information”, “Modelling & validation”, and “Management information”.  
3. Align the property category (technical / chemical / economic / other) with a compatible unit group.  
4. For updated datasets, link the previous version in “Management information”.

## Data validation & publish

1. **Save drafts** frequently to avoid losing progress.  
2. **Run `Data check`** on the process or model editor to validate required fields and references.  
3. **Submit for review** and monitor the status via the notification center or the filters described in [Data Review](/en/user-guide/data-review). For process datasets, the system may run a **Numerical stability gate** first. If you see “Review submission is queued,” “Numerical stability gate is running,” or “Review submission is still processing in the background,” make sure the data is saved and click **Submit for review** again later to refresh the latest status.  
4. **Collaborate** by contributing the dataset to your team if others need to continue the work.
