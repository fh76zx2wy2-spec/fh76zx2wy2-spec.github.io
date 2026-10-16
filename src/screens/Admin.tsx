import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTIVE_PROGRAM } from '../data/program';
import { supabase } from '../lib/supabase';
import { PageHeader, Sheet, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { durationLabel, timeLabel } from '../lib/format';
import { formatGreg, formatHijri } from '../lib/dates';
import { imageFileToJpeg, signedAvatarUrl } from '../lib/teamProfile';

type AdminMember = {
  member_id: string;
  user_id: string | null;
  email: string;
  display_name: string;
  registered: boolean;
  last_sign_in_at: string | null;
  avatar_path: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  program_template: string;
};
type AdminVisit = { id: string; user_id: string; email: string; display_name: string; date: string; arrived_at: string; left_at: string | null; duration_seconds: number };
type Audit = { id: string; action: string; target_name: string; visit_id: string | null; before_data: unknown; after_data: unknown; created_at: string };

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
function toIso(v: string): string | null { return v ? new Date(v).toISOString() : null; }
function normalizeEmail(v: string) { return v.trim().toLowerCase(); }

export default function Admin() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [visits, setVisits] = useState<AdminVisit[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminVisit | null>(null);
  const [arrived, setArrived] = useState('');
  const [left, setLeft] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [addUser, setAddUser] = useState('');
  const [addArrived, setAddArrived] = useState('');
  const [addLeft, setAddLeft] = useState('');

  const [memberAddOpen, setMemberAddOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null);
  const [memberBusy, setMemberBusy] = useState(false);
  const [memberEdit, setMemberEdit] = useState<AdminMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);

  const allowed = ACTIVE_PROGRAM.key === 'ziyad';

  async function refresh() {
    if (!supabase || !allowed) return;
    setLoading(true);
    try {
      const [m, v, a] = await Promise.all([
        supabase.rpc('admin_group_members'),
        supabase.rpc('admin_group_visits', { p_limit: 100 }),
        supabase.rpc('admin_audit', { p_limit: 50 }),
      ]);
      if (m.error) throw m.error; if (v.error) throw v.error; if (a.error) throw a.error;
      const rawMembers = (m.data ?? []) as AdminMember[];
      const signed = await Promise.all(rawMembers.map(async (x) => ({
        ...x,
        is_active: x.is_active !== false,
        avatar_url: await signedAvatarUrl(x.avatar_path ?? null, x.email),
      })));
      setMembers(signed);
      setVisits(((v.data ?? []) as AdminVisit[]).map((x) => ({ ...x, duration_seconds: Number(x.duration_seconds ?? 0) })));
      setAudit((a.data ?? []) as Audit[]);
      if (!addUser) setAddUser(signed.find((x) => x.registered && x.is_active)?.user_id ?? '');
    } catch (e) {
      toast(`تعذّر تحميل الإدارة: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [allowed]);
  const grouped = useMemo(() => members.map((m) => ({ ...m, visits: visits.filter((v) => v.email === m.email) })), [members, visits]);
  const activeCount = members.filter((m) => m.is_active).length;

  if (!allowed) return <div className="page stack"><PageHeader title="الإدارة" onBack={() => nav('/')} /><div className="card center">هذه الصفحة متاحة للأدمن فقط.</div></div>;

  function openEdit(v: AdminVisit) { setEditing(v); setArrived(toLocalInput(v.arrived_at)); setLeft(toLocalInput(v.left_at)); }
  async function saveEdit() {
    if (!supabase || !editing || !arrived) return;
    const { error } = await supabase.rpc('admin_update_gym_visit', { p_visit_id: editing.id, p_arrived_at: toIso(arrived), p_left_at: toIso(left) });
    if (error) return toast(`تعذر التعديل: ${error.message}`);
    setEditing(null); toast('تم تعديل الزيارة وتسجيل العملية ✓'); void refresh();
  }
  async function finishNow(v: AdminVisit) {
    if (!supabase) return;
    const { error } = await supabase.rpc('admin_update_gym_visit', { p_visit_id: v.id, p_arrived_at: v.arrived_at, p_left_at: new Date().toISOString() });
    if (error) return toast(`تعذر إنهاء الزيارة: ${error.message}`);
    toast(`تم إنهاء زيارة ${v.display_name} الآن ✓`); void refresh();
  }
  async function remove(v: AdminVisit) {
    if (!supabase || !window.confirm(`حذف زيارة ${v.display_name} بتاريخ ${v.date}؟ سيُسجل الحذف في سجل الإدارة.`)) return;
    const { error } = await supabase.rpc('admin_delete_gym_visit', { p_visit_id: v.id });
    if (error) return toast(`تعذر الحذف: ${error.message}`);
    toast('تم حذف الزيارة ✓'); void refresh();
  }
  async function addVisit() {
    if (!supabase || !addUser || !addArrived) return toast('اختر العضو ووقت الوصول');
    const { error } = await supabase.rpc('admin_add_gym_visit', { p_user_id: addUser, p_arrived_at: toIso(addArrived), p_left_at: toIso(addLeft) });
    if (error) return toast(`تعذر إضافة الزيارة: ${error.message}`);
    setAddOpen(false); setAddArrived(''); setAddLeft(''); toast('تمت إضافة الزيارة ✓'); void refresh();
  }

  async function uploadMemberPhoto(memberId: string, file: File) {
    if (!supabase) throw new Error('الخدمة غير مهيأة');
    const jpeg = await imageFileToJpeg(file);
    const path = `members/${memberId}/profile.jpg`;
    const { error: uploadError } = await supabase.storage.from('coach-profiles').upload(path, jpeg, {
      upsert: true,
      contentType: 'image/jpeg',
      cacheControl: '3600',
    });
    if (uploadError) throw uploadError;
    const { error: saveError } = await supabase.rpc('admin_set_team_member_avatar', { p_member_id: memberId, p_avatar_path: path });
    if (saveError) throw saveError;
  }

  async function addMember() {
    if (!supabase || memberBusy) return;
    const email = normalizeEmail(memberEmail);
    const name = memberName.trim();
    if (name.length < 2) return toast('اكتب اسم العضو');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast('اكتب بريدًا صحيحًا');
    setMemberBusy(true);
    try {
      const { data, error } = await supabase.rpc('admin_add_team_member', { p_email: email, p_display_name: name });
      if (error) throw error;
      const memberId = String(data ?? '');
      if (!memberId) throw new Error('لم يرجع رقم العضو');
      if (memberPhoto) await uploadMemberPhoto(memberId, memberPhoto);
      setMemberAddOpen(false); setMemberName(''); setMemberEmail(''); setMemberPhoto(null);
      toast(`تمت إضافة ${name} ✓ سيستطيع الدخول بحساب Google نفسه`);
      await refresh();
    } catch (e) {
      toast(`تعذر إضافة العضو: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setMemberBusy(false); }
  }

  function openMemberEdit(m: AdminMember) {
    setMemberEdit(m); setEditName(m.display_name); setEditActive(m.is_active); setEditPhoto(null);
  }

  async function saveMemberEdit() {
    if (!supabase || !memberEdit || memberBusy) return;
    const name = editName.trim();
    if (name.length < 2) return toast('اكتب اسم العضو');
    setMemberBusy(true);
    try {
      const { error } = await supabase.rpc('admin_update_team_member', {
        p_member_id: memberEdit.member_id,
        p_display_name: name,
        p_is_active: editActive,
      });
      if (error) throw error;
      if (editPhoto) await uploadMemberPhoto(memberEdit.member_id, editPhoto);
      setMemberEdit(null); setEditPhoto(null);
      toast('تم حفظ بيانات العضو ✓');
      await refresh();
    } catch (e) {
      toast(`تعذر حفظ العضو: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setMemberBusy(false); }
  }

  const auditTitle = (action: string) => ({
    update_visit: 'تعديل زيارة', add_visit: 'إضافة زيارة', delete_visit: 'حذف زيارة',
    add_member: 'إضافة عضو', reactivate_member: 'إعادة تفعيل عضو', update_member: 'تعديل عضو',
    set_member_avatar: 'تغيير صورة عضو', data_fix_abdulsalam_second_latest: 'تصحيح زيارة',
  } as Record<string, string>)[action] ?? 'تعديل إداري';

  return (
    <div className="page stack admin-page">
      <PageHeader title="إدارة 45/4" onBack={() => nav('/settings')} sub="خاص بزياد · الأعضاء والحضور" />
      <section className="admin-hero">
        <div><div className="eyebrow">وضع الأدمن</div><h2>فريقك من جوالك</h2><p>أضف أعضاء وصورهم، وعدّل الزيارات. أي عضو جديد يأخذ نفس جدول زياد 4 أيام × 45 دقيقة.</p></div>
        <span className="admin-shield"><Icon name="gear" size={26} /></span>
      </section>
      <div className="admin-actions-grid">
        <button className="btn btn-primary" onClick={() => { setMemberName(''); setMemberEmail(''); setMemberPhoto(null); setMemberAddOpen(true); }}><Icon name="plus" /> عضو جديد</button>
        <button className="btn btn-soft-cold" onClick={() => { const now = new Date(); setAddArrived(toLocalInput(now.toISOString())); setAddLeft(''); setAddOpen(true); }}><Icon name="plus" /> إضافة زيارة</button>
        <button className="btn btn-ghost" onClick={() => void refresh()}><Icon name="undo" /> تحديث</button>
      </div>

      <section className="card">
        <div className="row-between" style={{ marginBottom: 10 }}><div><div className="eyebrow">الأعضاء</div><div className="card-title">فريق 45/4</div></div><span className="tag tag-cold">{activeCount} نشط</span></div>
        <div className="admin-members-grid">
          {members.map((m) => <button type="button" className={`admin-member admin-member-button ${!m.is_active ? 'inactive' : ''}`} key={m.email} onClick={() => openMemberEdit(m)}>
            {m.avatar_url ? <img className="admin-avatar-img" src={m.avatar_url} alt={`صورة ${m.display_name}`} /> : <span className="admin-avatar">{m.display_name.slice(0,1)}</span>}
            <div className="grow"><b>{m.display_name}</b><small>{m.email}</small><small>{m.program_template === 'ziyad' ? 'نفس جدول زياد' : m.program_template}</small></div>
            <div className="admin-member-tags"><span className={`tag ${m.registered ? 'tag-solid' : ''}`}>{m.registered ? 'مسجل' : 'بانتظار الدخول'}</span>{!m.is_active && <span className="tag tag-hot">موقوف</span>}</div>
            <Icon name="chevL" size={18} />
          </button>)}
        </div>
        <div className="note-box cold" style={{ marginTop: 12 }}>لإضافة شخص لاحقًا: اضغط <b>عضو جديد</b>، اكتب اسمه وبريده واختر صورته من الآيفون. لا تحتاج SQL بعد هذا التحديث.</div>
        <div className="note-box" style={{ marginTop: 8 }}>كل عضو منافسته خاصة مع زياد: لا يرى الأعضاء الآخرين، بينما أنت كأدمن ترى الجميع.</div>
      </section>

      <section className="card pad-0">
        <div className="row-between" style={{ padding: '16px 18px 8px' }}><div><div className="eyebrow">الحضور</div><div className="card-title">آخر الزيارات</div></div>{loading && <span className="muted">تحميل…</span>}</div>
        {grouped.flatMap((m) => m.visits.slice(0, 12)).sort((a,b) => b.arrived_at.localeCompare(a.arrived_at)).slice(0,40).map((v) => (
          <div className={`admin-visit-row ${!v.left_at ? 'open' : ''}`} key={v.id}>
            <div className="grow"><div className="row" style={{ gap: 7 }}><b>{v.display_name}</b>{!v.left_at && <span className="tag tag-hot">في النادي الآن</span>}</div><small>{formatHijri(v.date,{year:false})} · {formatGreg(v.date)} · {timeLabel(v.arrived_at)}{v.left_at ? ` ← ${timeLabel(v.left_at)}` : ''}</small></div>
            <b>{durationLabel(v.duration_seconds)}</b>
            <button className="icon-btn" aria-label="تعديل" onClick={() => openEdit(v)}><Icon name="edit" size={17} /></button>
            {!v.left_at && <button className="btn btn-sm btn-primary" onClick={() => void finishNow(v)}>إنهاء الآن</button>}
            <button className="icon-btn danger" aria-label="حذف" onClick={() => void remove(v)}><Icon name="trash" size={17} /></button>
          </div>
        ))}
      </section>

      <section className="card">
        <div className="row-between" style={{ marginBottom: 10 }}><div><div className="eyebrow">سجل التدقيق</div><div className="card-title">ماذا عدّل الأدمن؟</div></div><span className="tag">آخر {audit.length}</span></div>
        <div className="audit-list">
          {audit.length === 0 ? <div className="muted">لا توجد تعديلات إدارية بعد.</div> : audit.map((a) => <div key={a.id} className="audit-row"><span className="audit-dot"/><div className="grow"><b>{auditTitle(a.action)}</b><small>{a.target_name} · {new Date(a.created_at).toLocaleString('ar-SA')}</small></div></div>)}
        </div>
      </section>

      <Sheet open={memberAddOpen} onClose={() => !memberBusy && setMemberAddOpen(false)} title="إضافة عضو جديد" footer={<button className="btn btn-primary btn-lg btn-block" disabled={memberBusy} onClick={() => void addMember()}>{memberBusy ? 'جارٍ الحفظ…' : 'إضافة العضو'}</button>}>
        <div className="member-add-intro"><div className="member-add-icon"><Icon name="plus" size={24} /></div><div><b>ينسخ جدول زياد تلقائيًا</b><small>4 أيام × 45 دقيقة · ونفس مكتبة الأجهزة والبدائل.</small></div></div>
        <div className="field"><label>الاسم الذي يظهر في 45/4</label><input className="input" value={memberName} onChange={(e)=>setMemberName(e.target.value)} placeholder="مثال: أبو عمر" autoComplete="off" /></div>
        <div className="field"><label>حساب Google</label><input className="input ltr" dir="ltr" type="email" inputMode="email" value={memberEmail} onChange={(e)=>setMemberEmail(e.target.value)} placeholder="name@gmail.com" autoCapitalize="none" autoCorrect="off" /></div>
        <div className="field"><label>الصورة الشخصية <span className="muted">(اختيارية)</span></label><label className="photo-picker"><input type="file" accept="image/*" onChange={(e)=>setMemberPhoto(e.target.files?.[0] ?? null)} /><Icon name="plus" size={20} /><span>{memberPhoto ? memberPhoto.name : 'اختر صورة من الآيفون'}</span></label></div>
        <div className="note-box cold">بعد الإضافة، يدخل العضو بنفس البريد أعلاه من زر Google. لا تنشئ له كلمة مرور.</div>
        <div className="note-box">الخصوصية: العضو سيرى <b>نفسه وزياد فقط</b>. لن يرى أسماء بقية الأعضاء ولا زياراتهم ولا منافساتهم.</div>
      </Sheet>

      <Sheet open={!!memberEdit} onClose={() => !memberBusy && setMemberEdit(null)} title={memberEdit ? `إدارة ${memberEdit.display_name}` : 'إدارة العضو'} footer={<button className="btn btn-primary btn-lg btn-block" disabled={memberBusy} onClick={() => void saveMemberEdit()}>{memberBusy ? 'جارٍ الحفظ…' : 'حفظ التعديلات'}</button>}>
        {memberEdit && <>
          <div className="member-edit-head">{memberEdit.avatar_url ? <img src={memberEdit.avatar_url} alt="" /> : <span>{memberEdit.display_name.slice(0,1)}</span>}<div><b>{memberEdit.email}</b><small>{memberEdit.registered ? 'دخل إلى 45/4 من قبل' : 'لم يسجل دخوله بعد'}</small></div></div>
          <div className="field"><label>الاسم</label><input className="input" value={editName} onChange={(e)=>setEditName(e.target.value)} /></div>
          <div className="field"><label>تغيير الصورة <span className="muted">(اختياري)</span></label><label className="photo-picker"><input type="file" accept="image/*" onChange={(e)=>setEditPhoto(e.target.files?.[0] ?? null)} /><Icon name="plus" size={20} /><span>{editPhoto ? editPhoto.name : 'اختر صورة جديدة'}</span></label></div>
          <label className="member-active-toggle"><input type="checkbox" checked={editActive} onChange={(e)=>setEditActive(e.target.checked)} disabled={memberEdit.email === 'z062496@gmail.com'} /><span><b>العضو نشط</b><small>{memberEdit.email === 'z062496@gmail.com' ? 'لا يمكن إيقاف حساب الأدمن' : 'إذا أوقفته لن يكون ضمن الفريق أو الإشعارات.'}</small></span></label>
          <div className="note-box">البرنامج: <b>نسخة من جدول زياد 4 أيام × 45 دقيقة</b></div>
        </>}
      </Sheet>

      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing ? `تعديل زيارة ${editing.display_name}` : 'تعديل زيارة'} footer={<button className="btn btn-primary btn-lg btn-block" onClick={() => void saveEdit()}>حفظ التعديل</button>}>
        <div className="field"><label>وقت الوصول</label><input type="datetime-local" className="input" value={arrived} onChange={(e)=>setArrived(e.target.value)} /></div>
        <div className="field"><label>وقت الخروج <span className="muted">(اتركه فارغًا لجعل الزيارة مفتوحة)</span></label><input type="datetime-local" className="input" value={left} onChange={(e)=>setLeft(e.target.value)} /></div>
        {arrived && <div className="row admin-duration-presets"><button type="button" className="btn btn-sm btn-soft" onClick={() => setLeft(toLocalInput(new Date(new Date(arrived).getTime() + 45 * 60_000).toISOString()))}>45 دقيقة</button><button type="button" className="btn btn-sm btn-soft-cold" onClick={() => setLeft(toLocalInput(new Date(new Date(arrived).getTime() + 60 * 60_000).toISOString()))}>ساعة</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => setLeft('')}>زيارة مفتوحة</button></div>}
        {arrived && left && <div className="note-box cold">المدة الجديدة: <b>{durationLabel(Math.max(0,(new Date(left).getTime()-new Date(arrived).getTime())/1000))}</b></div>}
      </Sheet>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="إضافة زيارة" footer={<button className="btn btn-primary btn-lg btn-block" onClick={() => void addVisit()}>إضافة الزيارة</button>}>
        <div className="field"><label>العضو</label><select className="input" value={addUser} onChange={(e)=>setAddUser(e.target.value)}>{members.filter(m=>m.registered && m.user_id && m.is_active).map(m=><option key={m.email} value={m.user_id!}>{m.display_name}</option>)}</select></div>
        <div className="field"><label>الوصول</label><input type="datetime-local" className="input" value={addArrived} onChange={(e)=>setAddArrived(e.target.value)} /></div>
        <div className="field"><label>الخروج <span className="muted">(اختياري)</span></label><input type="datetime-local" className="input" value={addLeft} onChange={(e)=>setAddLeft(e.target.value)} /></div>
      </Sheet>
    </div>
  );
}
