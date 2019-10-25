# CrmUG2019
A sample project for **Advance Dynamics 365 CE Customization utilizing modern JS** presentation. 
This project also incorporates the **React PowerApps Component Framework Public Preview**

**Thanks to all those who came to my presentation. I am deeply humbled and amazed at the number of people who want to be the "Scotty" on their Enterprise. I plan to add new projects in the future once pcf react becomes live.**

[Use of React and Office UI Fabric React in the PowerApps component framework is now available for public preview](https://powerapps.microsoft.com/en-us/blog/use-of-react-and-office-ui-fabric-react-in-the-powerapps-component-framework-is-now-available-for-public-preview/)

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

#### PCF ie11 support
You need to modify the node_modules\pcf-scripts\webpackConfig.js rule for js/jsx to be the same as rule found in package.json.
