/* global Xrm */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Rating } from "office-ui-fabric-react/lib/Rating";
import {
  ScrollablePane,
  ScrollbarVisibility
} from "office-ui-fabric-react/lib/ScrollablePane";
import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  Selection,
  SelectionMode
} from "office-ui-fabric-react/lib/DetailsList";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

import { getItems } from "../js/crmUG.store";

const { openForm } = Xrm.Navigation,
  { getGlobalContext } = Xrm.Utility,
  selection = new Selection(),
  getFarItems = id => {
    const dispatch = useDispatch();

    return [
      {
        key: "newIncident",
        name: "New",
        iconProps: { iconName: "FabricNewFolder" },
        onClick: () => {
          openForm({
            entityName: "incident",
            createFromEntity: { entityType: "account", id },
            openInNewWindow: true,
            windowPosition: 1
          });
        }
      },
      {
        key: "refresh",
        name: "Refresh",
        iconProps: { iconName: "Refresh" },
        onClick: () => {
          dispatch(getItems());
        }
      },
      {
        key: "testOData",
        name: "Test OData",
        iconProps: { iconName: "TestBeakerSolid" },
        onClick: async () => {
          const { getClientUrl } = getGlobalContext(),
            headers = {
              "OData-MaxVersion": "4.0",
              "OData-Version": "4.0",
              Accept: "application/json",
              "Content-Type": "application/json; charset=utf-8",
              Prefer: `odata.include-annotations="*"`
            },
            data = await fetch(
              `${getClientUrl()}/api/data/v9.1/accounts?$select=name&$top=10`,
              {
                method: "GET",
                headers
              }
            ),
            json = data && (await data.json());

          console.log(JSON.stringify(json.value));
        }
      }
    ];
  };

export default function CrmUG() {
  const rating = useSelector(state => state.rating),
    maxRating = useSelector(state => state.maxRating),
    columns = useSelector(state => state.columns),
    items = useSelector(state => state.items),
    accountId = useSelector(state => state.accountId);

  return (
    <Fabric>
      <div style={{ display: "flex" }}>
        <Label>Rating: </Label>
        <Rating
          rating={rating}
          max={maxRating}
          icon="FlameSolid"
          unselectedIcon="Suitcase"
          allowZeroStars
        />
      </div>
      <ScrollablePane
        scrollbarVisibility={ScrollbarVisibility.auto}
        style={{
          height: `${window.innerHeight - 100}px`,
          position: "relative"
        }}
      >
        <DetailsList
          columns={columns}
          items={items}
          selection={selection}
          compact
          selectionPreservedOnEmptyClick
          checkboxVisibility={CheckboxVisibility.always}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.multiple}
          onItemInvoked={item => {
            openForm({
              entityName: "incident",
              entityId: item.id
            });
          }}
        />
      </ScrollablePane>
      <CommandBar farItems={getFarItems(accountId)} />
    </Fabric>
  );
}
