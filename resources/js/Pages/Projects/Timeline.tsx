import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft, Printer, Plus, ChevronDown, ChevronRight,
    CheckCircle2, Clock, AlertCircle, LayoutList, StickyNote,
} from 'lucide-react';

interface TimelineTask {
    id: number;
    name: string;
    status: 'Pending' | 'Partial' | 'Done';
    client_confirmation: 'Pending' | 'Confirmed';
    order: number;
}

interface TimelineSegment {
    id: number;
    name: string;
    note: string | null;
    order: number;
    tasks: TimelineTask[];
}

interface Project {
    id: number;
    name: string;
}

interface Props {
    project: Project;
    segments: TimelineSegment[];
}

const SEGMENT_COLORS = [
    { header: 'from-violet-600 to-violet-500', light: 'bg-violet-500/10 border-violet-500/30 text-violet-300' },
    { header: 'from-blue-600 to-blue-500',     light: 'bg-blue-500/10 border-blue-500/30 text-blue-300'     },
    { header: 'from-emerald-600 to-emerald-500', light: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
    { header: 'from-rose-600 to-rose-500',     light: 'bg-rose-500/10 border-rose-500/30 text-rose-300'     },
    { header: 'from-amber-600 to-amber-500',   light: 'bg-amber-500/10 border-amber-500/30 text-amber-300'  },
    { header: 'from-cyan-600 to-cyan-500',     light: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'     },
];

const STATUS_CYCLE: TimelineTask['status'][] = ['Pending', 'Partial', 'Done'];
const CONFIRMATION_CYCLE: TimelineTask['client_confirmation'][] = ['Pending', 'Confirmed'];

function cycleStatus(current: TimelineTask['status']): TimelineTask['status'] {
    return STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
}
function cycleConfirmation(current: TimelineTask['client_confirmation']): TimelineTask['client_confirmation'] {
    return current === 'Pending' ? 'Confirmed' : 'Pending';
}

function statusClasses(status: TimelineTask['status']) {
    if (status === 'Done')    return 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/35';
    if (status === 'Partial') return 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/35';
    return 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/35';
}

function statusIcon(status: TimelineTask['status']) {
    if (status === 'Done')    return <CheckCircle2 className="h-3 w-3" />;
    if (status === 'Partial') return <Clock className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
}

function confirmationClasses(conf: TimelineTask['client_confirmation']) {
    if (conf === 'Confirmed') return 'bg-teal-500/20 text-teal-400 border-teal-500/40 hover:bg-teal-500/35';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/40 hover:bg-slate-500/35';
}

// ─── Segment Block ────────────────────────────────────────────────────────────

interface SegmentBlockProps {
    segment: TimelineSegment;
    colorIdx: number;
    project: Project;
}

function SegmentBlock({ segment, colorIdx, project }: SegmentBlockProps) {
    const color = SEGMENT_COLORS[colorIdx % SEGMENT_COLORS.length];
    const [open, setOpen] = useState(true);
    const [note, setNote] = useState(segment.note ?? '');
    const [addingTask, setAddingTask] = useState(false);
    const [newTask, setNewTask] = useState('');
    const taskInputRef = useRef<HTMLInputElement>(null);

    const doneCount = segment.tasks.filter(t => t.status === 'Done').length;
    const totalCount = segment.tasks.length;

    function saveNote() {
        router.patch(route('projects.timeline.segments.note', [project.id, segment.id]), { note }, { preserveScroll: true });
    }

    function submitTask(e: React.FormEvent) {
        e.preventDefault();
        if (!newTask.trim()) return;
        router.post(route('projects.timeline.tasks.store', [project.id, segment.id]), { name: newTask }, {
            preserveScroll: true,
            onSuccess: () => { setNewTask(''); setAddingTask(false); },
        });
    }

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
            {/* Header */}
            <div className={`bg-gradient-to-r ${color.header} flex items-start justify-between gap-4 px-5 py-4`}>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-3 text-white flex-shrink-0 mt-0.5"
                >
                    {open
                        ? <ChevronDown className="h-5 w-5 opacity-80" />
                        : <ChevronRight className="h-5 w-5 opacity-80" />}
                    <span className="font-bold text-base tracking-wide">{segment.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/25 font-semibold whitespace-nowrap">
                        {doneCount}/{totalCount} Done
                    </span>
                </button>

                {/* Note */}
                <div className="flex items-start gap-2 flex-1 max-w-md" onClick={e => e.stopPropagation()}>
                    <StickyNote className="h-4 w-4 text-white/60 mt-2 flex-shrink-0" />
                    <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        onBlur={saveNote}
                        placeholder="Add segment note..."
                        rows={2}
                        className="w-full text-xs bg-white/15 border border-white/25 rounded-lg px-3 py-2
                                   text-white placeholder:text-white/50 resize-none focus:outline-none
                                   focus:ring-2 focus:ring-white/40 transition-all print:hidden"
                    />
                    {note && (
                        <span className="text-white/80 text-xs mt-2 hidden print:block italic max-w-[200px]">{note}</span>
                    )}
                </div>
            </div>

            {/* Table */}
            {open && (
                <div className="bg-card">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/50">
                                <th className="px-5 py-3 text-left w-[56%]">Task Name</th>
                                <th className="px-5 py-3 text-center w-[22%]">Status</th>
                                <th className="px-5 py-3 text-center w-[22%]">Client Confirmation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {segment.tasks.map((task, tIdx) => (
                                <tr
                                    key={task.id}
                                    className={`transition-colors hover:bg-muted/25 ${tIdx % 2 === 1 ? 'bg-muted/10' : ''}`}
                                >
                                    <td className="px-5 py-3 font-medium text-foreground/90">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0 border ${color.light}`}>
                                                {tIdx + 1}
                                            </span>
                                            {task.name}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            onClick={() => router.patch(
                                                route('timeline-tasks.update-status', task.id),
                                                { status: cycleStatus(task.status) },
                                                { preserveScroll: true }
                                            )}
                                            title="Click to change status"
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border
                                                        text-xs font-semibold transition-all cursor-pointer
                                                        ${statusClasses(task.status)}`}
                                        >
                                            {statusIcon(task.status)}
                                            {task.status}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            onClick={() => router.patch(
                                                route('timeline-tasks.update-confirmation', task.id),
                                                { client_confirmation: cycleConfirmation(task.client_confirmation) },
                                                { preserveScroll: true }
                                            )}
                                            title="Click to toggle confirmation"
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border
                                                        text-xs font-semibold transition-all cursor-pointer
                                                        ${confirmationClasses(task.client_confirmation)}`}
                                        >
                                            {task.client_confirmation === 'Confirmed'
                                                ? <CheckCircle2 className="h-3 w-3" />
                                                : <Clock className="h-3 w-3" />}
                                            {task.client_confirmation}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Task Row */}
                    <div className="px-5 py-3 border-t border-border/30 bg-muted/5 print:hidden">
                        {addingTask ? (
                            <form onSubmit={submitTask} className="flex items-center gap-2">
                                <input
                                    ref={taskInputRef}
                                    autoFocus
                                    value={newTask}
                                    onChange={e => setNewTask(e.target.value)}
                                    placeholder="Task name..."
                                    className="flex-1 text-sm bg-background border border-border/60 rounded-lg
                                               px-3 py-1.5 text-foreground placeholder:text-muted-foreground
                                               focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                                <Button type="submit" size="sm" className="h-8 text-xs">Add</Button>
                                <Button type="button" size="sm" variant="ghost" className="h-8 text-xs"
                                        onClick={() => { setAddingTask(false); setNewTask(''); }}>
                                    Cancel
                                </Button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setAddingTask(true)}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Task
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Timeline({ project, segments }: Props) {
    const [addingSegment, setAddingSegment] = useState(false);
    const [newSegmentName, setNewSegmentName] = useState('');

    const allTasks = segments.flatMap(s => s.tasks);
    const doneCount    = allTasks.filter(t => t.status === 'Done').length;
    const partialCount = allTasks.filter(t => t.status === 'Partial').length;
    const pendingCount = allTasks.filter(t => t.status === 'Pending').length;
    const confirmedCount = allTasks.filter(t => t.client_confirmation === 'Confirmed').length;
    const totalCount = allTasks.length;
    const donePercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    function submitSegment(e: React.FormEvent) {
        e.preventDefault();
        if (!newSegmentName.trim()) return;
        router.post(route('projects.timeline.segments.store', project.id), { name: newSegmentName }, {
            preserveScroll: true,
            onSuccess: () => { setNewSegmentName(''); setAddingSegment(false); },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="print:hidden">
                            <Link href={route('projects.show', project.id)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <LayoutList className="h-5 w-5 text-primary" />
                            <div>
                                <h1 className="text-lg font-bold leading-tight">Project Timeline</h1>
                                <p className="text-xs text-muted-foreground">{project.name}</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        className="border-primary/20 hover:bg-primary/5 print:hidden"
                    >
                        <Printer className="mr-2 h-4 w-4 text-primary" /> Print / PDF
                    </Button>
                </div>
            }
        >
            <Head title={`Project Timeline — ${project.name}`} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Total Tasks" value={totalCount} sub={`${donePercent}% complete`}
                                  color="text-foreground" bg="bg-card border border-border/50" />
                        <StatCard label="Done" value={doneCount}
                                  sub={`${donePercent}%`}
                                  color="text-green-400" bg="bg-green-500/10 border border-green-500/20" />
                        <StatCard label="Partial" value={partialCount}
                                  sub={`${totalCount > 0 ? Math.round((partialCount / totalCount) * 100) : 0}%`}
                                  color="text-amber-400" bg="bg-amber-500/10 border border-amber-500/20" />
                        <StatCard label="Pending" value={pendingCount}
                                  sub={`${confirmedCount} client confirmed`}
                                  color="text-red-400" bg="bg-red-500/10 border border-red-500/20" />
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-card border border-border/50 rounded-xl px-5 py-4">
                        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                            <span>Overall Progress</span>
                            <span className="font-semibold text-foreground">{donePercent}%</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${donePercent}%` }}
                            />
                        </div>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Done: {doneCount}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Partial: {partialCount}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Pending: {pendingCount}
                            </span>
                        </div>
                    </div>

                    {/* Hint */}
                    <p className="text-xs text-muted-foreground italic print:hidden">
                        Tip: Click any <strong>Status</strong> or <strong>Client Confirmation</strong> badge to update it instantly.
                    </p>

                    {/* Segments */}
                    <div className="space-y-5">
                        {segments.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <LayoutList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                <p>No segments yet. Add one below.</p>
                            </div>
                        )}
                        {segments.map((segment, idx) => (
                            <SegmentBlock
                                key={segment.id}
                                segment={segment}
                                colorIdx={idx}
                                project={project}
                            />
                        ))}
                    </div>

                    {/* Add Segment */}
                    <div className="print:hidden">
                        {addingSegment ? (
                            <form onSubmit={submitSegment} className="flex items-center gap-2 mt-2">
                                <input
                                    autoFocus
                                    value={newSegmentName}
                                    onChange={e => setNewSegmentName(e.target.value)}
                                    placeholder="Segment name (e.g. App, Mobile...)"
                                    className="flex-1 text-sm bg-background border border-border/60 rounded-lg
                                               px-4 py-2 text-foreground placeholder:text-muted-foreground
                                               focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                                <Button type="submit" size="sm">Add Segment</Button>
                                <Button type="button" size="sm" variant="ghost"
                                        onClick={() => { setAddingSegment(false); setNewSegmentName(''); }}>
                                    Cancel
                                </Button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setAddingSegment(true)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary
                                           transition-colors font-medium py-2"
                            >
                                <Plus className="h-4 w-4" /> Add Segment
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    nav, header, footer { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .bg-card { background: white !important; }
                    table { border-collapse: collapse; }
                    th, td { border: 1px solid #e5e7eb; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, sub, color, bg }: {
    label: string; value: number; sub: string; color: string; bg: string;
}) {
    return (
        <div className={`rounded-xl px-4 py-3 ${bg}`}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
    );
}
