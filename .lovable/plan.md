
**Bulk Import/Export for Admin Panel**

To enable efficient data management for Admissions and Scholarships, we will add bulk CSV import and export functionality. This allows administrators to download the data to a spreadsheet, make edits or add new entries, and upload it back.

Here is the step-by-step approach:

1. **Create CSV Utilities (`src/lib/csv.ts`)**
   - Create a reusable utility file for handling CSV generation and parsing.
   - `exportToCsv`: A function to convert an array of JSON objects into a CSV string, properly handling special characters, escaping quotes, and converting array fields (like `programs`, `levels`) into string format separated by a `|` (pipe). It will also automatically trigger a file download in the browser.
   - `parseCsv`: A function to read a CSV string back into an array of JSON objects, intelligently parsing back the array fields separated by `|` and converting boolean-like strings (`"true"`, `"false"`) into actual booleans.

2. **Update Admin Admissions Page (`src/pages/admin/AdminAdmissions.tsx`)**
   - Add two new buttons in the header area: **Export CSV** (with a Download icon) and **Import CSV** (with an Upload icon).
   - **Export Flow**: Clicking "Export" will take the currently filtered data (or all data) and pass it to our `exportToCsv` function, downloading an `admissions.csv` file.
   - **Import Flow**: Clicking "Import" will open a hidden file input. Once a CSV is selected, the browser will read it as text, pass it to `parseCsv`, format the data for the database (handling arrays and removing system fields like `id` and `created_at` for new entries), and perform a bulk `insert` (or `upsert`) via Supabase. We will use the existing `useToast` hook to show success or error notifications.

3. **Update Admin Scholarships Page (`src/pages/admin/AdminScholarships.tsx`)**
   - Mirror the same functionality as Admissions.
   - Add **Export CSV** and **Import CSV** buttons.
   - Implement the respective handlers configured for the `admin_scholarships` Supabase table and its specific fields (like `budget_friendly`, `funding_type`, `deadline`, etc.).

This approach keeps the logic reusable, doesn't require any heavy external dependencies, and provides a native-feeling experience for admins.
