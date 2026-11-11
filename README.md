# ServiceOps – Partner Performance Tracker

A beginner-friendly web application portfolio project for monitoring service calls, TAT compliance, pending workload and service partner performance.

## Features

- KPI cards for total, closed, pending, TAT compliance and overdue calls
- Filter by service partner and region
- Partner call-volume comparison
- Service call register with age, SLA and result
- Upload your own CSV file
- Responsive layout for desktop and mobile
- Runs in the browser; no server or database required

## Technologies

- HTML5
- CSS3
- JavaScript (vanilla)

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a web browser.
3. Select **Upload CSV** to load your own sample-format data.

## CSV format

The uploaded CSV must contain these column names:

| Column | Meaning | Example |
|---|---|---|
| `call_id` | Unique service call reference | CALL-1001 |
| `partner` | Service partner name | Gayatri Infotech |
| `region` | Service location/region | Rajahmundry |
| `allocated_date` | Date the call was allocated (YYYY-MM-DD) | 2026-11-07 |
| `closed_date` | Closure date; leave blank if open | 2026-11-08 |
| `status` | `Closed` or `Pending` | Pending |
| `sla_days` | Agreed SLA duration in calendar days | 2 |

## Calculation notes

- Call age is calculated from allocation date to closure date, or to the current date for open calls.
- An open call is overdue when its age is greater than its row-level `sla_days`.
- TAT compliance is the percentage of closed calls closed within their row-level SLA.
- This demo uses calendar days. Before using operational data, adapt the calculations to your approved rules for Sunday/holiday exclusions, part-call SLA start dates, carry-in calls and other service categories.

## Publish with GitHub Pages

1. Create a new public repository named `serviceops-partner-performance-tracker`.
2. Upload `index.html`, `styles.css`, `app.js`, `sample_calls.csv` and this `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish. Your live site URL will appear in the Pages section.

## Portfolio note

This project uses fictional sample data. Do not publish customer names, phone numbers, serial numbers, real call IDs or confidential company information.
