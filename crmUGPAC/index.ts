import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { initializeIcons } from "@uifabric/icons";
import { isUUID } from "validator";

import store, {
  setContext,
  setColumns,
  setAccountId,
  setRating,
  setMaxRating,
  setItems,
  getItems
} from "../src/js/crmUG.store";
import CrmUG from "../src/jsx/crmUGPAC";

initializeIcons();
export class crmUGPAC
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  // Reference to the container div
  private theContainer: HTMLDivElement;

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this.theContainer = container;

    store.dispatch(setContext(context));
    store.dispatch(
      setColumns([
        {
          fieldName: "ticketnumber",
          key: "ticketnumber",
          name: "ID",
          isResizable: true,
          minWidth: 100,
          maxWidth: 200
        },
        {
          fieldName: "title",
          key: "title",
          name: "Case Title",
          isResizable: true
        }
      ])
    );

    ReactDOM.render(React.createElement(CrmUG), this.theContainer);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    try {
      const { accountId, rating, maxRating, items } = context.parameters,
        { sAccountId, sRating, sMaxRating, sItems } = store.getState();

      if (rating.raw !== sRating) store.dispatch(setRating(rating.raw));

      if (maxRating.raw !== sMaxRating)
        store.dispatch(setMaxRating(maxRating.raw));

      if (items.raw !== JSON.stringify(sItems)) {
        // @ts-ignore
        store.dispatch(setItems(JSON.parse(items.raw)));
      }

      if (isUUID(accountId.raw) && accountId.raw !== sAccountId) {
        store.dispatch(setAccountId(accountId.raw));
        store.dispatch(getItems());
      }
    } catch (ex) {
      console && console.error(ex.message || ex);
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    const { accountId, rating, maxRating, items } = store.getState();

    return { accountId, rating, maxRating, items };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this.theContainer);
  }
}
