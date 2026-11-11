# SAP CAP AI-Powered Demand Forecasting — Hands-On Exercise

Welcome! In this exercise you will build and deploy a full-stack AI application on SAP Business Technology Platform. The application uses a CAP Node.js backend to fetch sales order data from SAP S/4HANA Cloud, run it through an SAP AI Core forecasting model, and surface the results as Fiori Elements UI tiles in SAP Build Work Zone.

## Solution Overview

The diagram below shows the end-to-end architecture you will assemble step by step.

![SAP CAP AI-Powered Demand Forecasting — L1 Architecture](pages/00-home/img/cap_ai_architecture.drawio.png)

### How It Works

1. A business user opens the **Forecast Run** Fiori application in SAP Build Work Zone and triggers a forecast run.
2. The CAP service (`ForecastService`) calls `runForecast()` — an asynchronous pipeline that:
   - Fetches sales orders from SAP S/4HANA Cloud via the `API_SALES_ORDER_SRV` OData V2 API, using a BTP Destination (`S4_SO`) for connectivity and credentials.
   - Aggregates the orders into weekly ISO periods using a pre-processing script.
   - Sends the payload to the **SAP RPT 1.6 Large** model deployed on SAP AI Core (`/predict` endpoint).
   - Persists the forecast results in batches to SAP HANA Cloud.
3. The user switches to the **Forecast Result** application to review the model's demand predictions.

### Key SAP Services Used

| Service                                   | Role                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| **SAP BTP Cloud Foundry**                 | Hosts the CAP Node.js application and Fiori UI                  |
| **SAP AI Core + AI Launchpad**            | Runs the SAP RPT 1.6 Large forecasting model                    |
| **SAP HANA Cloud**                        | Persists `ForecastRun` and `ForecastResult` entities            |
| **SAP Build Work Zone, Standard Edition** | End-user launchpad serving the Fiori apps                       |
| **BTP Destination Service**               | Connects the CAP service to the S/4HANA OData V2 API            |
| **SAP S/4HANA Cloud**                     | Source of sales order data (`A_SalesOrder`, `A_SalesOrderItem`) |
| **XSUAA / SAP Cloud Identity Services**   | Authentication (OAuth 2.0 / OIDC)                               |

---

## Exercise Steps

Work through the steps in order. Each step builds on the previous one.

| Step   | Title                                                                             | What You Do                                                                                             |
| ------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **01** | [Set Up SAP AI Core and Deploy the RPT 1.6 Model](../01-ai-core-config/README.md) | Run the BTP Boosters for AI Launchpad and AI Core, then deploy the SAP RPT 1.6 Large model              |
| **02** | [Integrate SAP S/4HANA Cloud with SAP BTP](../02-s4-config/README.md)             | Create a Communication Arrangement in S/4HANA Cloud and a BTP Destination to expose the Sales Order API |
| **03** | [Build and Deploy the Application](../03-application-deploy/README.md)            | Build the MTA archive with `mbt build` and deploy it to Cloud Foundry with `cf deploy`                  |
| **04** | [Configure SAP Build Work Zone](../04-work-zone-config/README.md)                 | Create a Work Zone site, import the Fiori apps, and organise them into a launchpad group                |
| **05** | [End-to-End Test](../05-end-to-end-test/README.md)                                | Trigger a forecast run and verify the results in the Forecast Result application                        |

---

## Before You Begin

Ensure the following are in place before starting Step 01:

- An SAP BTP global account with the **SAP AI Core** (extended plan) and **SAP Build Work Zone** services entitled to your subaccount
- An SAP S/4HANA Cloud tenant with administrator access
- [Node.js](https://nodejs.org/) 18 or higher and [VS Code](https://code.visualstudio.com/) installed on your local machine
- Cloud Foundry CLI installed (you will install it in Step 03 if not already present)

> **Tip:** If you encounter any issues during the exercise, each step includes a **Troubleshooting** section with common symptoms and resolutions.
