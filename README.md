# CrmUG2019
A sample project for **Advance Dynamics 365 CE Customization utilizing modern JS** presentation. 
This project also incorporates the **React PowerApps Framework Component Public Preview**

###### Installation
  1. Open a Visual Studio Command Prompt
  2. npm i
  3. Install [PowerApps Cli](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/get-powerapps-cli) 

###### Commands
  - npm run build:< project >:dev - produces a browser debbugable version of the project
  - npm run build:< project > :prd - produces a minified version of the project
  
  // React PowerApps Component Framework public preview
  - npm run build
  - npm run clean
  - npm run rebuild
  - npm run start - opens the project in a test browser

###### Project
  - account - account form js 
  - crmUG - a simple ui that displays a rating scale and table list based on account cases

##### crmUGPAC
  1. Open a Visual Studio Command Prompt
  2. Go to crmUGPAC\crmUGPAC_deploy
  3. msbuild /t:build /restore
