using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace crmUGWorkflow
{
    public abstract partial class BaseWorkflow : CodeActivity
    {
        protected class LocalWorkflowContext : IDisposable
        {
            public CodeActivityContext CodeActivityContext { get; private set; }
            public IWorkflowContext WorkflowContext { get; private set; }
            public IOrganizationServiceFactory ServiceFactory { get; private set; }
            public Microsoft.Xrm.Sdk.Client.OrganizationServiceContext CrmContext { get; private set; }
            public IOrganizationService OrganizationService { get; private set; }
            public ITracingService TracingService { get; private set; }
            internal LocalWorkflowContext(CodeActivityContext codeActivityContext)
            {
                if (codeActivityContext == null)
                    throw new ArgumentNullException("codeActivityContext");

                // Set the code activity context
                this.CodeActivityContext = codeActivityContext;

                // Obtain the workflow context from the service provider.
                this.WorkflowContext = codeActivityContext.GetExtension<IWorkflowContext>();

                // Obtain the tracing service from the service provider.
                this.TracingService = codeActivityContext.GetExtension<ITracingService>();

                // Obtain the Organization Service factory service from the service provider
                this.ServiceFactory = codeActivityContext.GetExtension<IOrganizationServiceFactory>();

                // Use the factory to generate the Organization Service.
                this.OrganizationService = this.ServiceFactory.CreateOrganizationService(this.WorkflowContext.UserId);

                // Generate the CrmContext to use with LINQ etc
                this.CrmContext = new Microsoft.Xrm.Sdk.Client.OrganizationServiceContext(this.OrganizationService);
            }
            internal void Trace(string message)
            {
                if (string.IsNullOrWhiteSpace(message) || this.TracingService == null) return;

                if (this.WorkflowContext == null)
                    this.TracingService.Trace(message);
                else
                {
                    this.TracingService.Trace(
                        "{0}, Correlation Id: {1}, Initiating User: {2}",
                        message,
                        this.WorkflowContext.CorrelationId,
                        this.WorkflowContext.InitiatingUserId);
                }
            }
            public void Dispose()
            {
                if (this.CrmContext != null)
                    this.CrmContext.Dispose();
            }
        }
        protected abstract void ExecuteInternal(LocalWorkflowContext context);
        protected override void Execute(CodeActivityContext context)
        {
            using (var localContext = new LocalWorkflowContext(context))
            {
                localContext.Trace("Calling ExecuteInternal");
                try
                {
                    this.ExecuteInternal(localContext);
                }
                catch (Exception ex)
                {
                    localContext.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", ex.ToString()));
                    throw;
                }
                finally
                {
                    localContext.Trace("ExecuteInternal finished");
                }
            }
        }
    }
}
