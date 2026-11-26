# StoqWise Bug Report Format

Every bug is a GitHub Issue. Title format: `[Screen] Short description`
(example: `[Record sale] Complete sale works when quantity is above stock`).

## Template

**Steps to repeat**
1.
2.
3.

**Expected result**


**Actual result**


**Screenshot**
(drag the image into the issue)

**Severity**
- [ ] Critical: app crashes, data lost, wrong stock, or a role can reach a screen it should not
- [ ] Major: a feature does not work, but there is a workaround
- [ ] Minor: layout, wording or small visual issue

**Screen owner** (tag with @username)

**Environment**
Browser and version:
Screen size (375 / 768 / 1280):
Role logged in as (Admin / Sales Staff):

**Test case ID** (from test-plan.csv, e.g. TC-024)

## Screen owners

| Screen | Owner |
|---|---|
| Layout, shell, routing | Success |
| Styles, components, responsive CSS | Alex |
| Inventory and Product form | Egidio |
| Record sale, Receipt, Dashboard charts | Newton |
| Contexts and selectors | Nana |
| Sales history | Gabriel |
| Login, roles, validators | Rooney |
| Stock logic, mock data, low-stock banner | Alfred |
| Reports, export, GitHub setup | Risaalah |

## Bug life cycle
1. Gabriel opens the issue and tags the owner.
2. Owner fixes it on their own branch and opens a pull request into `dev`.
3. Success merges.
4. Gabriel repeats the original steps. Pass: close the issue. Fail: reopen with a comment.
