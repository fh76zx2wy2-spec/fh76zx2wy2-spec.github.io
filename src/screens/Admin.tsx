import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTIVE_PROGRAM } from '../data/program';
import { supabase } from '../lib/supabase';
import { PageHeader, Sheet, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { durationLabel, timeLabel } from '../lib/format';
import { formatGreg, formatHijri } from '../lib/dates';

type AdminMember = { user_id: string | null; email: string; display_name: string; registered: boolean; last_sign_in_at: string | null };
type AdminVisit = { id: string; user_id: string; email: string; display_name: string; date: string; arrived_at: string; left_at: string | null; duration_seconds: number };
type Audit = { id: string; action: string; target_name: string; visit_id: string | null; before_data: unknown; after_data: unknown; created_at: string };

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
function toIso(v: string): string | null { return v ? new Date(v).toISOString() : null; }

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

  const allowed = ACTIVE_PROGRAM.key === 'ziyad';

  async function refresh() {
    if (!supabase || !allowed) return;
    setLoading(true);
    try {
      const [m, v, a] = await Promise.all([
        supabase.rpc('admin_group_members'),
        supabase.rpc('admin_group_visits', { p_limit: 80 }),
        supabase.rpc('admin_audit', { p_limit: 40 }),
      ]);
      if (m.error) throw m.error; if (v.error) throw v.error; if (a.error) throw a.error;
      setMembers((m.data ?? []) as AdminMember[]);
      setVisits(((v.data ?? []) as AdminVisit[]).map((x) => ({ ...x, duration_seconds: Number(x.duration_seconds ?? 0) })));
      setAudit((a.data ?? []) as Audit[]);
      if (!addUser) setAddUser(((m.data ?? []) as AdminMember[]).find((x) => x.registered)?.user_id ?? '');
    } catch (e) {
      toast(`تعذّر تحميل الإدارة: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [allowed]);
  const grouped = useMemo(() => members.map((m) => ({ ...m, visits: visits.filter((v) => v.email === m.email) })), [members, visits]);

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

  return (
    <div className="page stack admin-page">
      <PageHeader title="إدارة 45/4" onBack={() => nav('/')} sub="خاص بزياد · تعديل الحضور والأعضاء" />
      <section className="admin-hero">
        <div><div className="eyebrow">وضع الأدمن</div><h2>أنت تتحكم بسجل الحضور</h2><p>كل تعديل يُحفظ في سجل مستقل حتى لا تضيع حقيقة البيانات.</p></div>
        <span className="admin-shield"><Icon name="gear" size={26} /></span>
      </section>
      <div className="row admin-actions-top">
        <button className="btn btn-primary grow" onClick={() => { const now = new Date(); setAddArrived(toLocalInput(now.toISOString())); setAddLeft(''); setAddOpen(true); }}><Icon name="plus" /> إضافة زيارة</button>
        <button className="btn btn-ghost" onClick={() => void refresh()}><Icon name="undo" /> تحديث</button>
      </div>

      <section className="card">
        <div className="row-between" style={{ marginBottom: 10 }}><div><div className="eyebrow">الأعضاء</div><div className="card-title">فريق 45/4</div></div><span className="tag tag-cold">3 أعضاء</span></div>
        <div className="admin-members-grid">
          {members.map((m) => <div className="admin-member" key={m.email}>
            <span className="admin-avatar">{m.display_name.slice(0,1)}</span>
            <div className="grow"><b>{m.display_name}</b><small>{m.email}</small></div>
            <span className={`tag ${m.registered ? 'tag-solid' : ''}`}>{m.registered ? 'مسجل' : 'بانتظار الدخول'}</span>
          </div>)}
        </div>
      </section>

      <section className="card pad-0">
        <div className="row-between" style={{ padding: '16px 18px 8px' }}><div><div className="eyebrow">الحضور</div><div className="card-title">آخر الزيارات</div></div>{loading && <span className="muted">تحميل…</span>}</div>
        {grouped.flatMap((m) => m.visits.slice(0, 12)).sort((a,b) => b.arrived_at.localeCompare(a.arrived_at)).slice(0,35).map((v) => (
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
          {audit.length === 0 ? <div className="muted">لا توجد تعديلات إدارية بعد.</div> : audit.map((a) => <div key={a.id} className="audit-row"><span className="audit-dot"/><div className="grow"><b>{a.action === 'update_visit' ? 'تعديل زيارة' : a.action === 'add_visit' ? 'إضافة زيارة' : a.action === 'delete_visit' ? 'حذف زيارة' : 'تصحيح بيانات'}</b><small>{a.target_name} · {new Date(a.created_at).toLocaleString('ar-SA')}</small></div></div>)}
        </div>
      </section>

      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing ? `تعديل زيارة ${editing.display_name}` : 'تعديل زيارة'} footer={<button className="btn btn-primary btn-lg btn-block" onClick={() => void saveEdit()}>حفظ التعديل</button>}>
        <div className="field"><label>وقت الوصول</label><input type="datetime-local" className="input" value={arrived} onChange={(e)=>setArrived(e.target.value)} /></div>
        <div className="field"><label>وقت الخروج <span className="muted">(اتركه فارغًا لجعل الزيارة مفتوحة)</span></label><input type="datetime-local" className="input" value={left} onChange={(e)=>setLeft(e.target.value)} /></div>
        {arrived && <div className="row admin-duration-presets"><button type="button" className="btn btn-sm btn-soft" onClick={() => setLeft(toLocalInput(new Date(new Date(arrived).getTime() + 45 * 60_000).toISOString()))}>45 دقيقة</button><button type="button" className="btn btn-sm btn-soft-cold" onClick={() => setLeft(toLocalInput(new Date(new Date(arrived).getTime() + 60 * 60_000).toISOString()))}>ساعة</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => setLeft('')}>زيارة مفتوحة</button></div>}
        {arrived && left && <div className="note-box cold">المدة الجديدة: <b>{durationLabel(Math.max(0,(new Date(left).getTime()-new Date(arrived).getTime())/1000))}</b></div>}
      </Sheet>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="إضافة زيارة" footer={<button className="btn btn-primary btn-lg btn-block" onClick={() => void addVisit()}>إضافة الزيارة</button>}>
        <div className="field"><label>العضو</label><select className="input" value={addUser} onChange={(e)=>setAddUser(e.target.value)}>{members.filter(m=>m.registered && m.user_id).map(m=><option key={m.email} value={m.user_id!}>{m.display_name}</option>)}</select></div>
        <div className="field"><label>الوصول</label><input type="datetime-local" className="input" value={addArrived} onChange={(e)=>setAddArrived(e.target.value)} /></div>
        <div className="field"><label>الخروج <span className="muted">(اختياري)</span></label><input type="datetime-local" className="input" value={addLeft} onChange={(e)=>setAddLeft(e.target.value)} /></div>
      </Sheet>
    </div>
  );
}
