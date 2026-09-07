AFTER THE ALERT — SYNTHETIC SPLUNK LAB
Author: Harsimran Sidhu
Article: https://harsim.ca/after-the-alert-splunk-case/

This is fictional teaching material, not a customer incident.
No commands in the records need to be executed on an endpoint.

Setup:
1. Use an authorized Splunk lab and open Search & Reporting.
2. Settings > Lookups > Lookup table files > Add new.
3. Upload soc-login-case.csv with that exact destination filename.
4. Run each search in searches.txt separately. Ask an administrator if
   lookup upload or app permissions are unavailable.
5. Results are tables; check the Statistics tab.

This is a lookup exercise, not an ingestion tutorial. No index is required.
The time picker does not automatically filter inputlookup rows.
Timestamps have explicit UTC offsets. Only the first investigative search
applies a time filter; later examples use the same fixed incident fixture.

Schema:
event_id: stable teaching record reference, not Windows EventRecordID.
timestamp: UTC timestamp with +0000 offset.
source_type: teaching label, not an actual Splunk sourcetype.
host: destination computer.
user: normalized account; all rows belong to the fictional LAB domain.
src_ip: reported authentication source; blank for process records.
event_code: 4625 failure, 4624 successful logon, 4688 process creation.
logon_type: 10 remote interactive; 3 network.
logon_id: normalized session ID. For processes this fixture assumes matching
creator and execution contexts. Map real subject/target fields carefully.
command: synthetic command line; blank for authentication rows.

198.51.100.44 is a documentation-only address, not an IOC to investigate.
The file contains 24 failures, 2 successes, and 4 process records.
The selected timeline has 28 rows: A01-A25 and P01-P03.
B01 and B02 form a separate session and must not be merged into it.
Every record is unique. The dataset is intentionally small and incomplete.

Fictional contextual notes (not generated from CSV):
14:18 UTC: Alex denies activity via established corporate directory contact.
14:21 UTC: Asset owner reports no approved task identified in that window.
14:23 UTC: Network source-to-device mapping remains pending.
These are exercise inputs, not real interviews.

Expected assessment: suspected unauthorized remote access, escalation
recommended. Access observed; actor, initial credential acquisition, scope,
persistence, lateral movement and data loss are not established.
No response or containment action is claimed to have been performed.

Validation:
Repository tests check fixture totals, dates, session separation and download
search synchronization. Searches have not been executed against a live
Splunk deployment. This is not a production detection rule.
