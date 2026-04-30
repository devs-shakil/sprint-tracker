import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Plus, Calendar, ArrowRight, Target, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Segment {
    id: number;
    name: string;
}

interface Member {
    id: number;
    user: {
        name: string;
    };
}

interface Task {
    id: number;
    status: string;
}

interface SprintGoal {
    id: number;
    is_completed: boolean;
}

interface Sprint {
    id: number;
    sprint_number: number;
    start_date: string;
    end_date: string;
    tasks: Task[];
    goals: SprintGoal[];
}

interface Project {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    segments: Segment[];
    members: Member[];
    sprints: Sprint[];
}

interface Props {
    projects: Project[];
    can: {
        create: boolean;
    };
}

function daysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function isUrgent(dateStr: string): boolean {
    const d = daysUntil(dateStr);
    return d >= 0 && d <= 2;
}

export default function Index({ projects, can }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const calculateProgress = (project: Project) => {
        const allTasks = project.sprints.flatMap(s => s.tasks);
        if (allTasks.length === 0) return 0;
        return Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100);
    };

    const getCurrentSprint = (project: Project) =>
        project.sprints.find(s => today >= s.start_date && today <= s.end_date) ?? null;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-serif text-2xl font-normal leading-tight text-foreground tracking-tight">
                        Projects
                    </h2>
                    {can.create && (
                        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
                            <Link href={route('projects.create')} className="flex items-center">
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Link>
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-10 bg-muted/20 min-h-screen">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-serif text-3xl font-normal text-foreground mb-2">No projects yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-sm">Create your first project to start tracking sprints and tasks.</p>
                            <Button size="lg">
                                <Link href={route('projects.create')}>Get Started</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const progress = calculateProgress(project);
                                const cur = getCurrentSprint(project);
                                const deadlineUrgent = isUrgent(project.end_date);
                                const deadlineDays = daysUntil(project.end_date);
                                const isActive = project.status === 'active';
                                const isCompleted = project.status === 'completed';

                                return (
                                    <div
                                        key={project.id}
                                        className="group bg-black/50 border border-border/60 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Coloured top stripe */}
                                        {/* <div className={`h-1.5 w-full ${isCompleted ? 'bg-green-400' : isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} /> */}

                                        {/* Header */}
                                        <div className="px-5 pt-5 pb-3">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <Badge
                                                    variant={isActive ? 'default' : 'secondary'}
                                                    className={`capitalize text-[11px] px-2.5 py-0.5 ${isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
                                                >
                                                    {isCompleted && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                    {project.status}
                                                </Badge>

                                                {/* Deadline badge */}
                                                <div className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 ${
                                                    deadlineDays < 0
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : deadlineUrgent
                                                            ? 'bg-red-500/20 text-red-400 deadline-urgent'
                                                            : 'bg-muted text-muted-foreground'
                                                }`}>
                                                    {deadlineDays < 0
                                                        ? <><AlertTriangle className="h-3 w-3" /> Overdue</>
                                                        : deadlineUrgent
                                                            ? <><AlertTriangle className="h-3 w-3" /> {deadlineDays}d left</>
                                                            : <><Calendar className="h-3 w-3" /> {project.end_date}</>
                                                    }
                                                </div>
                                            </div>

                                            <h3 className="font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                                {project.name}
                                            </h3>
                                        </div>

                                        {/* Body */}
                                        <div className="px-5 pb-4 space-y-4 flex-1">
                                            {/* Current sprint */}
                                            {cur && (() => {
                                                const done = cur.tasks.filter(t => t.status === 'completed').length;
                                                const total = cur.tasks.length;
                                                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                                const goalsDone = cur.goals.filter(g => g.is_completed).length;
                                                const goalsTotal = cur.goals.length;
                                                const sprintUrgent = isUrgent(cur.end_date);
                                                const sprintDays = daysUntil(cur.end_date);
                                                return (
                                                    <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                                <TrendingUp className="h-3 w-3" /> Sprint {cur.sprint_number}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {sprintDays < 0 ? (
                                                                    <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">Overdue</span>
                                                                ) : sprintUrgent ? (
                                                                    <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
                                                                        <AlertTriangle className="inline h-2.5 w-2.5 mr-0.5" />{sprintDays}d left
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                        <Clock className="h-2.5 w-2.5" /> {sprintDays}d left
                                                                    </span>
                                                                )}
                                                                <span className="text-[11px] font-bold text-primary">{pct}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                            <span>{done}/{total} tasks done</span>
                                                            {goalsTotal > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <Target className="h-2.5 w-2.5" /> {goalsDone}/{goalsTotal} goals
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Overall progress */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Overall Progress</span>
                                                    <span className="text-sm font-bold text-primary">{progress}%</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer CTA */}
                                        <Link
                                            href={route('projects.show', project.id)}
                                            className="flex items-center justify-between px-5 py-3.5 border-t border-border/50 bg-muted/20 hover:bg-primary/5 transition-colors group/link"
                                        >
                                            <span className="text-sm font-semibold text-primary">View Details</span>
                                            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
