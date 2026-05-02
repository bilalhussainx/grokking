-- AUD-X-006 (OpenClaw 2026-05-02): Claremont McKenna College displayed
-- "0% accept" and "$0 net price" — both bad seed values. Real values per
-- IPEDS / institutional data: ~9% acceptance, ~$33,500 average net price.
--
-- Idempotent: only updates the row if the current values look like the
-- bad-data signature (zero acceptance, zero net price).

UPDATE cc_schools
SET
  acceptance_rate = 0.10,
  avg_net_price = 33500
WHERE name ILIKE '%claremont%mckenna%'
  AND (acceptance_rate = 0 OR acceptance_rate IS NULL)
  AND (avg_net_price = 0 OR avg_net_price IS NULL);

-- Ad-hoc audit query (read-only, kept here for the next person who hits
-- the same class of bug). Run in SQL editor to see other rows that look
-- like seed errors:
--
-- SELECT name, acceptance_rate, avg_net_price
-- FROM cc_schools
-- WHERE (acceptance_rate = 0 OR avg_net_price = 0)
--   AND name NOT ILIKE '%community%'
--   AND name NOT ILIKE '%online%'
-- ORDER BY name;
