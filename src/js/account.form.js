/* global Xrm */
import { parsePhoneNumberFromString, ParseError } from "libphonenumber-js";

let isPhoneValid = true;

export function formOnLoad(executionContext) {
  const formContext = executionContext.getFormContext(),
    formType = formContext.ui.getFormType();

  formContext.getControl("WebResource_crmUG").setVisible(formType !== 1);
}

export async function formOnsave(executionContext) {
  try {
    const saveMode = executionContext.getEventArgs().getSaveMode();

    if (saveMode === 70 && !isPhoneValid) return;

    const formContext = executionContext && executionContext.getFormContext(),
      telephone1 = formContext && formContext.getAttribute("telephone1"),
      telephone1Value = (telephone1 && telephone1.getValue()) || "",
      address1_country =
        formContext && formContext.getAttribute("address1_country"),
      address1_countryValue =
        (address1_country && address1_country.getValue()) || "US";

    if (!telephone1Value || !address1_countryValue) return;

    const { openAlertDialog } = Xrm.Navigation,
      result = parsePhoneNumberFromString(
        telephone1Value,
        address1_countryValue
      );

    if (!result || !result.isValid()) {
      executionContext.getEventArgs().preventDefault();
      await openAlertDialog({ text: "Invalid Phone Number" });
      formContext.getControl("telephone1").setFocus();
      isPhoneValid = false;
    } else {
      isPhoneValid = true;
    }
  } catch (ex) {
    if (ex instanceof ParseError) {
      console && console.error(ex.message);
    }
  }
}

export function telephone1OnChange(executionContext) {
  try {
    const formContext = executionContext && executionContext.getFormContext(),
      telephone1 = formContext && formContext.getAttribute("telephone1"),
      telephone1Value = (telephone1 && telephone1.getValue()) || "",
      address1_country =
        formContext && formContext.getAttribute("address1_country"),
      address1_countryValue =
        (address1_country && address1_country.getValue()) || "US";

    if (!telephone1Value) return;

    const result = parsePhoneNumberFromString(
      telephone1Value,
      address1_countryValue
    );

    if (!result) return;

    telephone1.setValue(
      address1_countryValue === "US"
        ? result.formatNational()
        : result.formatInternational()
    );
  } catch (ex) {
    if (ex instanceof ParseError) {
      console && console.error(ex.message);
    }
  }
}
