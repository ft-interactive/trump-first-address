# Tests to run

### Tests on automatic update

- When you add an annotation, it should automatically show up on the page without affecting any of the other annotations
- When you add an annotation with more than one paragraph, it should also show up with o-expander
- When you add multiple annotations, they should automatically show up on the page without affecting other annotations
- When you add an annotation to the middle of the spreadsheet, the same thing should happen as if you add an annotation to the bottom of a spreadsheet.

### Tests on generating annotations on page

- All annotations published on the spreadsheet should show up on the page (any annotation with more than one paragraph should be collapsed)
- If you edit an annotation after it's been published, it will not automatically update, but should show an update on refresh
- If you delete an annotation after it's been published, it will not automatically delete itself, but it will be gone if you refresh the page
