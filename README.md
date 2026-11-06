FumiMKS2 224.5.1-M1.3.2 — Notice Only

SCOPE
- Changes are limited to Form Pemberitahuan Fumigasi (Notice).
- No Dashboard, sidebar, burger menu, queue UI, other modules, or global modal definitions are changed.
- Existing global FumiMKS2 success modal is called from Notice save/publish handlers only.
- New confirmation/error dialog CSS, markup, and handlers are scoped with notice-action-* selectors and used only by Notice.
- No delete action was added to the Notice form; existing queue delete flow remains untouched.
- Code.gs is carried forward unchanged from M1.3.1 because this refinement only changes Notice frontend interaction.
- PDF rendering/layout from M1.3.1 is retained.
- Apps Script and GitHub HTML copies are byte-identical.

STATIC VALIDATION
Node syntax checks and HTML structural checks are required before deployment.
No live Apps Script / Drive / PDF / mobile deployment test is claimed.
