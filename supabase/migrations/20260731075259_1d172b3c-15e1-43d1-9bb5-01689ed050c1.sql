-- 1) Restrict researcher read on thesis_requests to open requests only
DROP POLICY IF EXISTS requests_researcher_read_open ON public.thesis_requests;
CREATE POLICY requests_researcher_read_open ON public.thesis_requests
  FOR SELECT TO authenticated
  USING (status = 'open' AND public.has_role(auth.uid(), 'researcher'::public.app_role));

-- 2) Replace always-true consultation insert check with validation
DROP POLICY IF EXISTS consultations_public_insert ON public.consultations;
CREATE POLICY consultations_public_insert ON public.consultations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(full_name)) BETWEEN 2 AND 100
    AND mobile ~ '^09[0-9]{9}$'
    AND (description IS NULL OR length(description) <= 2000)
    AND (academic_level IS NULL OR length(academic_level) <= 50)
    AND (field_slug IS NULL OR length(field_slug) <= 50)
    AND (service_slug IS NULL OR length(service_slug) <= 50)
    AND status = 'new'
  );

-- 3) Harden has_role: answer only about the caller, and stop direct execution by signed-in users
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
