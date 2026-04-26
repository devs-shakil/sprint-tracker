import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Printer, Calendar, Target, MessageSquare, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';

interface Segment {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    segment: Segment | null;
}

interface SprintGoal {
    id: number;
    title: string;
    is_completed: boolean;
}

interface SprintMeeting {
    id: number;
    meeting_date: string;
    summary: string;
    decisions: string[];
}

interface Sprint {
    id: number;
    sprint_number: number;
    start_date: string;
    end_date: string;
    status: string;
    completion_note?: string;
    tasks: Task[];
    goals: SprintGoal[];
    meetings: SprintMeeting[];
}

interface Project {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    segments: Segment[];
}

interface Props {
    project: Project;
    sprints: Sprint[];
    month: string;
    availableMonths: string[];
}

function monthLabel(month: string) {
    const [y, m] = month.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function MonthlyReport({ project, sprints, month, availableMonths }: Props) {
    const totalTasks = sprints.flatMap(s => s.tasks).length;
    const completedTasks = sprints.flatMap(s => s.tasks).filter(t => t.status === 'completed').length;
    const totalGoals = sprints.flatMap(s => s.goals).length;
    const completedGoals = sprints.flatMap(s => s.goals).filter(g => g.is_completed).length;
    const totalMeetings = sprints.flatMap(s => s.meetings).length;
    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const goalsPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('projects.show', project.id)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-foreground">
                                Monthly Report — {monthLabel(month)}
                            </h2>
                            <p className="text-xs text-muted-foreground">{project.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={month}
                            onChange={e => router.get(route('projects.monthly-report', project.id), { month: e.target.value })}
                            className="text-xs bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {availableMonths.map(m => (
                                <option key={m} value={m}>{monthLabel(m)}</option>
                            ))}
                        </select>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="border-primary/20 hover:bg-primary/5">
                            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`Monthly Report — ${monthLabel(month)}`} />

            <style>{`
                @media print {
                    nav, header, .no-print { display: none !important; }
                    body { background: white; }
                    .print-page { padding: 20px; }
                }
            `}</style>

            <div className="py-8 bg-muted/30 min-h-screen print-page">
                <div className="max-w-5xl mx-auto px-6 space-y-8">

                    {/* Report Header */}
                    <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Client Report</div>
                                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" /> {monthLabel(month)}
                                </div>
                            </div>
                            <BarChart3 className="h-10 w-10 text-primary/20" />
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-muted/30 rounded-xl p-4 text-center space-y-1">
                                <div className="text-2xl font-bold text-primary">{completionPct}%</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Task Completion</div>
                                <div className="text-[11px] text-muted-foreground">{completedTasks}/{totalTasks} tasks</div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-4 text-center space-y-1">
                                <div className="text-2xl font-bold text-green-600">{goalsPct}%</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Goals Achieved</div>
                                <div className="text-[11px] text-muted-foreground">{completedGoals}/{totalGoals} goals</div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-4 text-center space-y-1">
                                <div className="text-2xl font-bold text-blue-600">{sprints.length}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Sprints</div>
                                <div className="text-[11px] text-muted-foreground">this month</div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-4 text-center space-y-1">
                                <div className="text-2xl font-bold text-purple-600">{totalMeetings}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Meetings</div>
                                <div className="text-[11px] text-muted-foreground">logged</div>
                            </div>
                        </div>
                    </div>

                    {sprints.length === 0 ? (
                        <div className="bg-background border border-dashed border-border/50 rounded-2xl p-12 text-center text-muted-foreground">
                            No sprints found for {monthLabel(month)}.
                        </div>
                    ) : sprints.map((sprint) => {
                        const sDone = sprint.tasks.filter(t => t.status === 'completed').length;
                        const sTotal = sprint.tasks.length;
                        const sPct = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0;

                        return (
                            <div key={sprint.id} className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                                {/* Sprint Header */}
                                <div className="px-6 py-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold text-base flex items-center gap-2">
                                            Sprint {sprint.sprint_number}
                                            <Badge variant="outline" className={`text-[10px] h-5 ${sprint.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-primary/5 text-primary border-primary/20'}`}>
                                                {sprint.status.toUpperCase()}
                                            </Badge>
                                        </h2>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Calendar className="h-3 w-3" /> {sprint.start_date} – {sprint.end_date}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-primary">{sPct}%</div>
                                        <div className="text-[10px] text-muted-foreground">{sDone}/{sTotal} done</div>
                                    </div>
                                </div>

                                <div className="px-6 py-5 space-y-5">
                                    {/* Weekly Goals */}
                                    {sprint.goals.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                <Target className="h-3.5 w-3.5 text-primary" /> Weekly Goals
                                            </h3>
                                            <div className="space-y-1.5">
                                                {sprint.goals.map(goal => (
                                                    <div key={goal.id} className="flex items-center gap-2 text-sm">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${goal.is_completed ? 'bg-green-400 border-green-400 text-white' : 'border-muted-foreground/40'}`}>
                                                            {goal.is_completed && <span className="text-[9px] font-bold">✓</span>}
                                                        </div>
                                                        <span className={goal.is_completed ? 'text-muted-foreground line-through' : ''}>{goal.title}</span>
                                                        {goal.is_completed && <Badge variant="outline" className="text-[9px] h-4 bg-green-50 text-green-700 border-green-200 ml-auto">Achieved</Badge>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Completed Tasks by Segment */}
                                    {project.segments.map(segment => {
                                        const segTasks = sprint.tasks.filter(t => t.segment?.id === segment.id && t.status === 'completed');
                                        if (segTasks.length === 0) return null;
                                        return (
                                            <div key={segment.id} className="space-y-2">
                                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> {segment.name}
                                                </h3>
                                                <ul className="space-y-1">
                                                    {segTasks.map(task => (
                                                        <li key={task.id} className="text-sm flex items-start gap-2 text-muted-foreground">
                                                            <span className="text-green-500 mt-0.5 shrink-0">✓</span> {task.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}

                                    {/* Incomplete Tasks */}
                                    {sprint.tasks.filter(t => t.status !== 'completed').length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                                                <AlertTriangle className="h-3.5 w-3.5" /> Incomplete Tasks
                                            </h3>
                                            <ul className="space-y-1">
                                                {sprint.tasks.filter(t => t.status !== 'completed').map(task => (
                                                    <li key={task.id} className="text-sm flex items-start gap-2 text-muted-foreground">
                                                        <span className="text-amber-400 mt-0.5 shrink-0">○</span> {task.title}
                                                    </li>
                                                ))}
                                            </ul>
                                            {sprint.completion_note && (
                                                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-800 whitespace-pre-wrap mt-2">
                                                    <span className="font-bold">Reason: </span>{sprint.completion_note}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Meeting Log */}
                                    {sprint.meetings.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                <MessageSquare className="h-3.5 w-3.5 text-primary" /> Meeting Log
                                            </h3>
                                            <div className="space-y-2">
                                                {sprint.meetings.map(meeting => (
                                                    <div key={meeting.id} className="bg-muted/20 border border-border/40 rounded-lg p-3 space-y-1">
                                                        <div className="text-[11px] font-bold text-primary/70">{meeting.meeting_date}</div>
                                                        <p className="text-xs font-medium">{meeting.summary}</p>
                                                        {meeting.decisions && meeting.decisions.length > 0 && (
                                                            <ul className="space-y-0.5 pt-0.5">
                                                                {meeting.decisions.map((d, i) => (
                                                                    <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                                                        <span className="text-primary shrink-0">•</span> {d}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
