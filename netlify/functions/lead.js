const Airtable = require("airtable");
require("dotenv").config();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);
  const { email, firstName, lastName, company, propertyType, totalUnits, avgRent, occupancyRate, staffSize,
    tenantScreening, maintenanceCoordination, rentCollection, leaseManagement, tenantCommunication,
    reporting, avgStaffWage, vacancyDays, latePaymentRate, maintenanceResponseTime, tenantTurnover,
    screeningCost, utm_source, utm_medium, utm_campaign, utm_content, referrer } = data;

  const laborSavings = avgStaffWage * (tenantScreening + maintenanceCoordination + rentCollection +
    leaseManagement + tenantCommunication + reporting) * 12;
  const revenueBoost = Math.round((vacancyDays / 365) * totalUnits * avgRent);
  const lateRecovered = Math.round((latePaymentRate / 100) * totalUnits * avgRent * 0.5);
  const roi = (((laborSavings + revenueBoost + lateRecovered) / (totalUnits * screeningCost)) * 100).toFixed(1);

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID);

  try {
    await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          Email: email,
          "First Name": firstName,
          "Last Name": lastName,
          Company: company,
          "Property Type": propertyType,
          "Total Units": totalUnits,
          "Avg Rent": avgRent,
          "Occupancy Rate": occupancyRate,
          "Staff Size": staffSize,
          "Tenant Screening": tenantScreening,
          "Maintenance Coordination": maintenanceCoordination,
          "Rent Collection": rentCollection,
          "Lease Management": leaseManagement,
          "Tenant Communication": tenantCommunication,
          Reporting: reporting,
          "Avg Staff Wage": avgStaffWage,
          "Vacancy Days": vacancyDays,
          "Late Payment Rate": latePaymentRate,
          "Maintenance Response Time": maintenanceResponseTime,
          "Tenant Turnover": tenantTurnover,
          "Screening Cost": screeningCost,
          "Projected Labor Savings": laborSavings,
          "Projected Revenue Boost": revenueBoost,
          "Projected Late Recovered": lateRecovered,
          ROI: parseFloat(roi),
          "utm_source": utm_source,
          "utm_medium": utm_medium,
          "utm_campaign": utm_campaign,
          "utm_content": utm_content,
          Referrer: referrer,
          "Raw Payload": JSON.stringify(data)
        },
      },
    ]);
    return { statusCode: 200, body: JSON.stringify({ success: true, roi }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
