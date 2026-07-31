DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- user_roles: own rows only (no recursive admin lookup)
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Recreate policies dropped by CASCADE
CREATE POLICY consultations_admin_read ON public.consultations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY consultations_admin_update ON public.consultations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY messages_participants_read ON public.messages
  FOR SELECT TO authenticated USING (
    auth.uid() = sender_id
    OR EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = messages.request_id AND r.student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.request_id = messages.request_id AND p.researcher_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY payments_admin_update ON public.payments
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY payments_student_read ON public.payments
  FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY proposals_researcher_manage ON public.proposals
  FOR ALL TO authenticated
  USING (auth.uid() = researcher_id OR public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = researcher_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY researchers_delete_admin ON public.researcher_profiles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY researchers_read_own ON public.researcher_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY researchers_update_own ON public.researcher_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY requests_owner_all ON public.thesis_requests
  FOR ALL TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY requests_researcher_read_open ON public.thesis_requests
  FOR SELECT TO authenticated
  USING (status = 'open' AND public.has_role(auth.uid(), 'researcher'::public.app_role));
