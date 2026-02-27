# Specification

## Summary
**Goal:** Clean up farm-market remnants from the Job Portal app and improve key features including the home page, dashboards, admin panel, and dark mode coverage.

**Planned changes:**
- Fix the browser tab title in `index.html` from "Farmer Market App" to "AI Job Portal"
- Remove the `FarmingChatbot` component entirely; keep only the `CareerChatbot` floating widget in the root layout
- Remove stub/redirect pages (`CartCheckout`, `CustomerDashboard`, `FarmerDashboard`, `ProductListing`) and replace or remove their navigation links; redirect those URLs to appropriate job portal pages
- Remove unused stub components (`EarningsSummary`, `ProductCard`, `ProductForm`, `ReviewForm`, `StripeConfigurationPanel`) and clean up any remaining imports
- Remove unused hooks (`useCart`, `useGenerateInvoicePDF`) and clean up any remaining imports
- Update the Home page hero section to use the blue-slate/teal color theme, fetch live platform stats (job count, user count) from the backend, and display at least 6 job categories with icons
- Add a numeric badge to the "Applications" tab in the Job Seeker Dashboard showing the total submitted application count, updating reactively
- Add bulk status update functionality to the Employer Dashboard applicant list: checkboxes for selecting multiple applicants and a bulk action to update their statuses (e.g., Shortlisted, Rejected)
- Fix the Admin Panel system reports section to fetch and display live counts from the backend (users by role, active jobs, total applications, total hires)
- Audit and apply Tailwind dark mode classes across all pages and dashboard components to ensure full dark mode coverage; persist dark mode preference across reloads

**User-visible outcome:** The app no longer shows any farm-market artifacts, all pages render correctly with the job portal theme, dark mode works consistently everywhere, and dashboards (job seeker, employer, admin) have improved real-time data and usability features.
