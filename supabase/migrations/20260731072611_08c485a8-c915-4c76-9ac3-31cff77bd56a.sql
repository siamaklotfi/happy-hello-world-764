-- ROLES
CREATE TYPE public.app_role AS ENUM ('student', 'researcher', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  mobile text,
  email text,
  university text,
  academic_level text,
  major text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile, university, academic_level, major)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'mobile',
    NEW.raw_user_meta_data ->> 'university',
    NEW.raw_user_meta_data ->> 'academic_level',
    NEW.raw_user_meta_data ->> 'major'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.raw_user_meta_data ->> 'role' = 'researcher' THEN 'researcher'::public.app_role
         ELSE 'student'::public.app_role END
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RESEARCHER PROFILES
CREATE TABLE public.researcher_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  degree text NOT NULL DEFAULT 'کارشناسی ارشد',
  university text,
  field_slug text NOT NULL DEFAULT 'engineering',
  major text,
  specialties text[] NOT NULL DEFAULT '{}',
  research_interests text,
  experience_years int NOT NULL DEFAULT 0,
  publications text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  bio text,
  portfolio text[] NOT NULL DEFAULT '{}',
  hourly_price bigint NOT NULL DEFAULT 500000,
  project_price_min bigint,
  project_price_max bigint,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  projects_count int NOT NULL DEFAULT 0,
  avatar_url text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.researcher_profiles TO authenticated;
GRANT SELECT ON public.researcher_profiles TO anon;
GRANT ALL ON public.researcher_profiles TO service_role;
ALTER TABLE public.researcher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "researchers_public_read" ON public.researcher_profiles FOR SELECT TO anon, authenticated
USING (approved = true);
CREATE POLICY "researchers_read_own" ON public.researcher_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "researchers_insert_own" ON public.researcher_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "researchers_update_own" ON public.researcher_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "researchers_delete_admin" ON public.researcher_profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER researcher_profiles_updated_at BEFORE UPDATE ON public.researcher_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- THESIS REQUESTS
CREATE TABLE public.thesis_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_level text NOT NULL,
  university text,
  field_slug text NOT NULL,
  major text,
  topic text NOT NULL,
  research_method text,
  service_slug text NOT NULL,
  deadline date,
  urgency text NOT NULL,
  complexity text NOT NULL,
  budget text,
  description text,
  estimate_min bigint,
  estimate_max bigint,
  status text NOT NULL DEFAULT 'open',
  selected_researcher_id uuid REFERENCES public.researcher_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thesis_requests TO authenticated;
GRANT ALL ON public.thesis_requests TO service_role;
ALTER TABLE public.thesis_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requests_owner_all" ON public.thesis_requests FOR ALL TO authenticated
USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "requests_researcher_read_open" ON public.thesis_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'researcher'));

CREATE TRIGGER thesis_requests_updated_at BEFORE UPDATE ON public.thesis_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROPOSALS
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.thesis_requests(id) ON DELETE CASCADE,
  researcher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price bigint NOT NULL,
  delivery_days int NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, researcher_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposals TO authenticated;
GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proposals_researcher_manage" ON public.proposals FOR ALL TO authenticated
USING (auth.uid() = researcher_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = researcher_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "proposals_student_read" ON public.proposals FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = request_id AND r.student_id = auth.uid()));
CREATE POLICY "proposals_student_update" ON public.proposals FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = request_id AND r.student_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = request_id AND r.student_id = auth.uid()));

-- MESSAGES
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.thesis_requests(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_participants_read" ON public.messages FOR SELECT TO authenticated
USING (
  auth.uid() = sender_id
  OR EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = request_id AND r.student_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.request_id = messages.request_id AND p.researcher_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "messages_participants_insert" ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id AND (
    EXISTS (SELECT 1 FROM public.thesis_requests r WHERE r.id = request_id AND r.student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.request_id = messages.request_id AND p.researcher_id = auth.uid())
  )
);

-- PAYMENTS / MILESTONES
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.thesis_requests(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount bigint NOT NULL,
  milestone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  invoice_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_student_read" ON public.payments FOR SELECT TO authenticated
USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "payments_student_insert" ON public.payments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = student_id);
CREATE POLICY "payments_admin_update" ON public.payments FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CONSULTATION LEADS
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile text NOT NULL,
  academic_level text,
  field_slug text,
  service_slug text,
  description text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consultations TO anon, authenticated;
GRANT SELECT, UPDATE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultations_public_insert" ON public.consultations FOR INSERT TO anon, authenticated
WITH CHECK (true);
CREATE POLICY "consultations_admin_read" ON public.consultations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "consultations_admin_update" ON public.consultations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SEED SHOWCASE RESEARCHERS
INSERT INTO public.researcher_profiles
(slug, display_name, degree, university, field_slug, major, specialties, experience_years, publications, bio, portfolio, hourly_price, rating, reviews_count, projects_count, approved)
VALUES
('sara-tehrani','دکتر سارا تهرانی','دکتری','دانشگاه تهران','management','مدیریت بازرگانی',ARRAY['رفتار مصرف‌کننده','مدل‌سازی معادلات ساختاری','Smart PLS'],11,ARRAY['طراحی مدل وفاداری مشتری در خرده‌فروشی آنلاین، فصلنامه مدیریت بازرگانی'],'پژوهشگر و مدرس مدیریت با تمرکز بر پژوهش‌های کمی و مدل‌سازی معادلات ساختاری.',ARRAY['پایان‌نامه ارشد: تأثیر بازاریابی محتوایی بر قصد خرید'],850000,4.9,132,210,true),
('mohammad-rezaei','دکتر محمد رضایی','دکتری','دانشگاه صنعتی شریف','engineering','مهندسی برق - کنترل',ARRAY['MATLAB','کنترل بهینه','یادگیری ماشین'],14,ARRAY['Robust control of nonlinear systems, IEEE Transactions'],'متخصص شبیه‌سازی سیستم‌های کنترلی و پیاده‌سازی الگوریتم‌های یادگیری ماشین.',ARRAY['شبیه‌سازی ریزشبکه هوشمند در MATLAB/Simulink'],1200000,4.8,98,175,true),
('elham-kazemi','دکتر الهام کاظمی','دکتری','دانشگاه علامه طباطبائی','humanities','روان‌شناسی تربیتی',ARRAY['پژوهش کیفی','SPSS','روش تحقیق آمیخته'],9,ARRAY['اثربخشی آموزش تاب‌آوری بر سازگاری تحصیلی'],'پژوهشگر روان‌شناسی تربیتی با تجربه در طراحی ابزار پژوهش و تحلیل مضمون.',ARRAY['پروپوزال دکتری: الگوی یادگیری خودتنظیم'],700000,4.9,76,140,true),
('arash-nouri','دکتر آرش نوری','دکتری','دانشگاه علوم پزشکی شهید بهشتی','medical','اپیدمیولوژی',ARRAY['تحلیل آماری پزشکی','STATA','مرور سیستماتیک'],12,ARRAY['Systematic review of metabolic risk factors, BMC Public Health'],'متخصص اپیدمیولوژی و آمار زیستی با همکاری در مطالعات بالینی.',ARRAY['مرور سیستماتیک و متاآنالیز عوامل خطر دیابت'],1100000,4.7,64,118,true),
('narges-shahbazi','دکتر نرگس شهبازی','دکتری','دانشگاه فردوسی مشهد','basic-science','آمار ریاضی',ARRAY['R','مدل‌های خطی تعمیم‌یافته','سری زمانی'],8,ARRAY['Bayesian time series forecasting, Statistical Papers'],'تحلیل‌گر داده و پژوهشگر آمار با تمرکز بر مدل‌سازی سری زمانی.',ARRAY['پیش‌بینی تقاضای انرژی با مدل ARIMA'],780000,4.8,51,96,true),
('hossein-maleki','مهندس حسین ملکی','کارشناسی ارشد','دانشگاه صنعتی امیرکبیر','engineering','مهندسی کامپیوتر - هوش مصنوعی',ARRAY['یادگیری عمیق','پردازش تصویر','Python'],7,ARRAY['Lightweight CNN for medical imaging, Elsevier Procedia'],'پژوهشگر هوش مصنوعی و پیاده‌سازی مدل‌های بینایی ماشین.',ARRAY['تشخیص ضایعات پوستی با شبکه عصبی عمیق'],900000,4.6,44,88,true),
('zeinab-farhadi','دکتر زینب فرهادی','دکتری','دانشگاه شیراز','agriculture','اقتصاد کشاورزی',ARRAY['مدل‌های اقتصادسنجی','Eviews','ارزیابی طرح'],10,ARRAY['کارایی فنی مزارع گندم، اقتصاد کشاورزی و توسعه'],'پژوهشگر اقتصاد کشاورزی با تمرکز بر ارزیابی اقتصادی طرح‌ها.',ARRAY['تحلیل بهره‌وری آب در مزارع جنوب کشور'],650000,4.7,39,74,true),
('kamran-ahmadi','دکتر کامران احمدی','دکتری','دانشگاه هنر تهران','art','معماری',ARRAY['معماری پایدار','Grasshopper','پژوهش طراحی‌محور'],13,ARRAY['Passive design strategies in hot-arid climates'],'پژوهشگر معماری پایدار و راهنمای رساله‌های طراحی‌محور.',ARRAY['رساله ارشد: بهینه‌سازی پوسته ساختمان'],950000,4.8,33,61,true);