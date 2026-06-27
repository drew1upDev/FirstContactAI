import { normalizePayload } from './src/services/lead-service';

const zillowPayload = {
  LeadDetails: {
    LeadName: "Zillow User",
    LeadEmail: "zillow@example.com",
    LeadPhone: "555-0001"
  }
};

const facebookPayload = {
  field_data: [
    { name: "full_name", values: ["FB User"] },
    { name: "email", values: ["fb@example.com"] },
    { name: "phone_number", values: ["555-0002"] }
  ]
};

console.log("Zillow:", normalizePayload('zillow', zillowPayload));
console.log("Facebook:", normalizePayload('facebook', facebookPayload));
console.log("Website:", normalizePayload('website', { name: "Web User", email: "web@example.com" }));
