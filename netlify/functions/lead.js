const Airtable = require("airtable");
require("dotenv").config();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      email,
      firstName,
      lastName,
      company,
      businessSize,
      industry,
      annualRevenue,
      avgWage,
      automationCategories,
      totalHoursSaved,
      annualCostSavings,
      roiPercent,
      paybackPeriodMonths,
      RawPayload,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer
    } = data;

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

    await base(process.env.AIRTABLE_TABLE_ID).create([
      {
        fields: {
          "Email": email,
          "First Name": firstName,
          "Last Name": lastName,
          "Company": company,
          "Business Size": businessSize,
          "Industry": industry,
          "Annual Revenue": annualRevenue,
          "Average Wage": avgWage,
          "Automation Categories": automationCategories.join(", "),
          "Total Hours Saved": totalHoursSaved,
          "Annual Cost Savings": annualCostSavings,
          "ROI (%)": roiPercent,
          "Payback Period (Months)": paybackPeriodMonths,
          "Raw Payload": JSON.stringify(RawPayload),
          "utm_source": utm_source,
          "utm_medium": utm_medium,
          "utm_campaign": utm_campaign,
          "utm_content": utm_content,
          "Referrer": referrer
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
