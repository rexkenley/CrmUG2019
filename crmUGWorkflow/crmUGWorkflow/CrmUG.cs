using crmUGWorkflow.ProxyClasses;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using System;
using System.Activities;
using System.Collections.Generic;

namespace crmUGWorkflow
{
    public partial class CrmUG : BaseWorkflow
    {
        [RequiredArgument, Input("Account Id")]
        public InArgument<string> AccountId { get; set; }

        [RequiredArgument, Output("Result")]
        public OutArgument<string> Result { get; set; }

        protected override void ExecuteInternal(LocalWorkflowContext context)
        {
            ITracingService tracing = context.CodeActivityContext.GetExtension<ITracingService>();
            IWorkflowContext wfContext = context.CodeActivityContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory serviceFactory =
                context.CodeActivityContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = serviceFactory.CreateOrganizationService(wfContext.UserId);

            try
            {
                Guid accountId = new Guid(AccountId.Get(context.CodeActivityContext));
                tracing.Trace($"crmUGWorkflow.CrmUG.ExecuteInternal({accountId})");

                account current = service.Retrieve(account.LogicalName, accountId,
                    new ColumnSet(new string[] { account.PrimaryIdAttribute, account.PrimaryNameAttribute })).ToEntity<account>();

                if (current == null)
                    throw new InvalidWorkflowException("Account Not Found.");

                IList<incident> cases = current.Getincident_customer_accounts(service,
                    new ColumnSet(new string[] { incident.PrimaryIdAttribute, "ticketnumber", "title", "casetypecode" }));

                Result.Set(context.CodeActivityContext, JsonConvert.SerializeObject(cases));
            }
            catch (Exception ex)
            {
                tracing.Trace(ex.ToString());
                throw;
            }
        }
    }
}