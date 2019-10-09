using crmUGPlugin.ProxyClasses;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace crmUGPlugin
{
    public partial class Account : BasePlugin
    {
        public Account(string unsecureConfig, string secureConfig) : base(unsecureConfig, secureConfig)
        {
            // Register for any specific events by instantiating a new instance of the 'PluginEvent' class and registering it
            base.RegisteredEvents.Add(new PluginEvent()
            {
                Stage = eStage.PostOperation,
                MessageName = MessageNames.Create,
                EntityName = EntityNames.account,
                PluginAction = ExecutePluginLogic
            });
        }

        public void ExecutePluginLogic(IServiceProvider serviceProvider)
        {
            // Use a 'using' statement to dispose of the service context properly
            // To use a specific early bound entity replace the 'Entity' below with the appropriate class type
            using (var localContext = new LocalPluginContext<Entity>(serviceProvider))
            {
                ITracingService tracing = localContext.TracingService;
                IOrganizationService service = localContext.OrganizationService;
                try
                {
                    tracing.Trace("crmUGPlugin.Account.ExecutePluginLogic()");

                    if (localContext.PluginExecutionContext.Depth > 1)
                        return;

                    account current = service.Retrieve(account.LogicalName, localContext.TargetEntity.Id,
                        new ColumnSet(new string[] { account.PrimaryIdAttribute, account.PrimaryNameAttribute })).ToEntity<account>();

                    current.vm_accountid = current.Id.ToString();

                    service.Update(current);
                }
                catch (Exception ex)
                {
                    tracing.Trace(ex.ToString());
                    throw;
                }
            }
        }
    }
}