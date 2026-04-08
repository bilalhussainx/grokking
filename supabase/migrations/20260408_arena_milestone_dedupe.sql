-- Task 8 follow-up: close the duplicate-XP race on milestone_complete events.
--
-- The milestones GET route checks existing events then inserts new ones; two
-- concurrent polls from the same user can both observe the gap and both insert,
-- awarding milestone XP twice. Enforce uniqueness at the DB layer via a partial
-- unique index keyed on (room_id, user_id, metadata->>'milestoneId'). The route
-- swallows the resulting 23505 unique-violation errors as a no-op success.
CREATE UNIQUE INDEX IF NOT EXISTS arena_score_events_milestone_unique
  ON arena_score_events (room_id, user_id, ((metadata->>'milestoneId')))
  WHERE event_type = 'milestone_complete' AND metadata->>'milestoneId' IS NOT NULL;
