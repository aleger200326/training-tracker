CREATE TABLE IF NOT EXISTS public.workout_data (
  user_id text PRIMARY KEY DEFAULT auth.user_id(),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workout_data_owner ON public.workout_data;
CREATE POLICY workout_data_owner ON public.workout_data
  FOR ALL TO authenticated
  USING ((SELECT auth.user_id()) = user_id)
  WITH CHECK ((SELECT auth.user_id()) = user_id);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_data TO authenticated;
