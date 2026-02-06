/**
 * MACHA Admissions - Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Google Sheets and create a new spreadsheet
 * 2. Name the first sheet "Applications"
 * 3. Add these headers in Row 1:
 *    Timestamp | First Name | Last Name | Date of Birth | Gender | Grade | 
 *    Parent Name | Phone | Email | Relationship | Address | County | 
 *    Previous School | Previous Grade | Medical | How Heard | Statement | Status
 * 4. Go to Extensions > Apps Script
 * 5. Delete any existing code and paste this entire file
 * 6. Click Deploy > New Deployment
 * 7. Select Type: Web App
 * 8. Set Execute as: Me
 * 9. Set Who has access: Anyone
 * 10. Click Deploy and authorize
 * 11. Copy the Web App URL
 * 12. Paste the URL in admissions.html where it says GOOGLE_SCRIPT_URL
 */

function doPost(e) {
    try {
        // Get the active spreadsheet and sheet
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications');

        // If sheet doesn't exist, create it
        if (!sheet) {
            sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Applications');
            // Add headers
            sheet.appendRow([
                'Timestamp', 'First Name', 'Last Name', 'Date of Birth', 'Gender', 'Grade',
                'Parent Name', 'Phone', 'Email', 'Relationship', 'Address', 'County',
                'Previous School', 'Previous Grade', 'Medical', 'How Heard', 'Statement', 'Status'
            ]);
        }

        // Get form data
        var data = e.parameter;

        // Append row with form data
        sheet.appendRow([
            data.timestamp || new Date().toLocaleString(),
            data.student_first_name || '',
            data.student_last_name || '',
            data.date_of_birth || '',
            data.gender || '',
            data.applying_for_grade || '',
            data.parent_name || '',
            data.parent_phone || '',
            data.parent_email || '',
            data.parent_relationship || '',
            data.address || '',
            data.county || '',
            data.previous_school || '',
            data.previous_grade || '',
            data.medical_conditions || '',
            data.how_heard || '',
            data.statement || '',
            'Pending' // Default status
        ]);

        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({ success: true, message: 'Application submitted!' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests (for testing)
function doGet(e) {
    return ContentService
        .createTextOutput('MACHA Admissions Script is running!')
        .setMimeType(ContentService.MimeType.TEXT);
}
