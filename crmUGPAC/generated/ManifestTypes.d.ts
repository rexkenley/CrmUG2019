/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    accountId: ComponentFramework.PropertyTypes.StringProperty;
    rating: ComponentFramework.PropertyTypes.WholeNumberProperty;
    maxRating: ComponentFramework.PropertyTypes.WholeNumberProperty;
    items: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    accountId?: string;
    rating?: number;
    maxRating?: number;
    items?: string;
}
