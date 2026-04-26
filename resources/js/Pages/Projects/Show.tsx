import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { Users, Calendar, ArrowLeft, Trash2, UserPlus, Plus, Clock, CheckCircle2, ChevronDown, ChevronRight, Edit2, Check, X, FileText, GitCommit as GitIcon, Copy, ExternalLink, Github, Gitlab, Target, MessageSquare, AlertTriangle, Minus, BarChart3, LayoutList } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

function daysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}
function isUrgent(dateStr: string): boolean {
    const d = daysUntil(dateStr);
    return d >= 0 && d <= 2;
}

interface Segment {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Member {
    id: number;
    user: User;
    segment?: Segment;
}

interface WorkingDay {
    id: number;
    date: string;
}

interface GitCommit {
    id: number;
    commit_hash: string;
    message: string;
    author: string;
    committed_at: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    estimated_hours: number;
    segment_id: number;
    sprint_id?: number;
    assignee?: User;
    git_commits?: GitCommit[];
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
    status: string;
    webhook_secret?: string;
    segments: Segment[];
    members: Member[];
    working_days: WorkingDay[];
    sprints: Sprint[];
}

interface Props {
    project: Project;
    developers: User[];
    can: {
        manage: boolean;
    };
}

export default function Show({ project, developers, can }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        segment_id: '',
    });

    const addMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.members.store', project.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const removeMember = (memberId: number) => {
        if (confirm('Are you sure you want to remove this member?')) {
            // We need a delete route for members
            // Inertia.delete(route('projects.members.destroy', [project.id, memberId]));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Link href={route('projects.index')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h2 className="font-serif text-2xl font-normal leading-tight text-foreground tracking-tight">
                            {project.name}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {can.manage && (
                            <>
                                <Button variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                                    <Link href={route('projects.monthly-report', project.id)} className="flex items-center">
                                        <BarChart3 className="mr-2 h-4 w-4 text-primary" /> Monthly Report
                                    </Link>
                                </Button>
                                <Button variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                                    <Link href={route('projects.reports.index', project.id)} className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4 text-primary" /> Project Report
                                    </Link>
                                </Button>
                                <Button onClick={() => router.post(route('projects.sprints.store-single', project.id))} className="bg-primary hover:bg-primary/90">
                                    <Plus className="mr-2 h-4 w-4" /> New Sprint
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="py-3 px-2">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className={`grid grid-cols-1 ${can.manage ? 'md:grid-cols-4' : ''} gap-6`}>
                        {/* Project Info */}
                        {/* <Card className={can.manage ? 'md:col-span-4' : ''}>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>Project timelines and segments.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Duration
                                        </Label>
                                        <div className="text-sm font-medium">
                                            {project.start_date} to {project.end_date}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-muted-foreground">Status</Label>
                                        <div>
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-muted-foreground">Working Days</Label>
                                        <div className="text-sm font-semibold text-primary">
                                            {project.working_days.length} Days
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-muted-foreground">Sprints</Label>
                                        <div className="text-sm font-semibold">
                                            {project.sprints.length} Total
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground">Segments</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {project.segments.map((segment) => (
                                            <Badge key={segment.id} variant="secondary" className="px-3 py-1">
                                                {segment.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Add Member Form - Owner Only */}
                        {/* {can.manage && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <UserPlus className="h-5 w-5" /> Add Team Member
                                    </CardTitle>
                                    <CardDescription>Assign a developer to a segment.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={addMember} className="space-y-4">
                                        <div>
                                            <Label htmlFor="user_id">Developer</Label>
                                            <select
                                                id="user_id"
                                                value={data.user_id}
                                                onChange={(e) => setData('user_id', e.target.value)}
                                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                required
                                            >
                                                <option value="">Select Developer</option>
                                                {developers.map((dev) => (
                                                    <option key={dev.id} value={dev.id}>
                                                        {dev.name} ({dev.email})
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.user_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="segment_id">Segment (Optional)</Label>
                                            <select
                                                id="segment_id"
                                                value={data.segment_id}
                                                onChange={(e) => setData('segment_id', e.target.value)}
                                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <option value="">General (No Segment)</option>
                                                {project.segments.map((segment) => (
                                                    <option key={segment.id} value={segment.id}>
                                                        {segment.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.segment_id} className="mt-2" />
                                        </div>

                                        <Button type="submit" className="w-full" disabled={processing}>
                                            Add to Project
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )} */}
                    </div>
                    
                    {/* Git Integration Section - Owner Only (Accordion) */}
                    {false && can.manage && (
                        <GitAccordion project={project} />
                    )}

                    {/* Sprints Section - Accordion Grid */}
                    <Card className="px-3 border-none shadow-none bg-transparent">
                        <CardHeader className="flex py-1 flex-row items-center justify-between px-0 pb-4">
                            <div>
                                <CardTitle className="font-serif text-3xl font-normal flex items-center gap-2 tracking-tight">
                                    <Calendar className="h-6 w-6 text-primary" /> Sprints
                                </CardTitle>
                                <CardDescription>Manage your project sprints and tasks.</CardDescription>
                            </div>
                            {can.manage && (
                                <div className="flex gap-2">
                                    {/* <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            if (confirm('Distribute all unassigned tasks across sprints and developers?')) {
                                                router.post(route('projects.tasks.distribute', project.id));
                                            }
                                        }}
                                        disabled={project.sprints.length === 0}
                                    >
                                        Distribute Tasks
                                    </Button> */}
                                    <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => router.post(route('projects.sprints.store-single', project.id))}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> New Sprint
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="px-0 space-y-4">
                            {project.sprints.length === 0 ? (
                                <Card className="p-12 text-center text-muted-foreground border-dashed">
                                    <p>No sprints yet. Click "New Sprint" to get started.</p>
                                </Card>
                            ) : (
                                project.sprints.map((sprint, index) => {
                                    const today = new Date().toISOString().split('T')[0];
                                    const isCurrent = today >= sprint.start_date && today <= sprint.end_date;
                                    
                                    return (
                                        <SprintAccordion 
                                            key={sprint.id} 
                                            sprint={sprint} 
                                            project={project} 
                                            can={can} 
                                            isDefaultOpen={isCurrent || (project.sprints.length > 0 && index === 0 && !project.sprints.some(s => today >= s.start_date && today <= s.end_date))}
                                            isCurrent={isCurrent}
                                        />
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    {/* Team Members List */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" /> Team Members
                            </CardTitle>
                            <CardDescription>All developers assigned to this project.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3">Member</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Segment</th>
                                            {can.manage && <th className="px-4 py-3 text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {project.members.length === 0 ? (
                                            <tr>
                                                <td colSpan={can.manage ? 4 : 3} className="px-4 py-8 text-center text-muted-foreground">
                                                    No team members assigned yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            project.members.map((member) => (
                                                <tr key={member.id} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3 font-medium">{member.user.name}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{member.user.email}</td>
                                                    <td className="px-4 py-3">
                                                        {member.segment ? (
                                                            <Badge variant="outline">{member.segment.name}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">General</span>
                                                        )}
                                                    </td>
                                                    {can.manage && (
                                                        <td className="px-4 py-3 text-right">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon"
                                                                onClick={() => removeMember(member.id)}
                                                                className="hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SprintAccordion({ sprint, project, can, isDefaultOpen = false, isCurrent = false }: { sprint: Sprint, project: Project, can: any, isDefaultOpen?: boolean, isCurrent?: boolean }) {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editDates, setEditDates] = useState({
        start_date: sprint.start_date,
        end_date: sprint.end_date
    });

    const handleSaveDates = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.patch(route('projects.sprints.update', [project.id, sprint.id]), editDates, {
            onSuccess: () => setIsEditingDate(false)
        });
    };

    const completedTasks = sprint.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = sprint.tasks.length;

    const endUrgent = sprint.status !== 'completed' && isUrgent(sprint.end_date);
    const endDays   = daysUntil(sprint.end_date);
    const overdue   = sprint.status !== 'completed' && endDays < 0;

    return (
        <Card className={`overflow-hidden transition-all duration-300 ${isCurrent ? 'border-2 border-primary shadow-lg animate-pulse-glow' : 'border-border/50 shadow-sm'}`}>
            <div
                onClick={() => !isEditingDate && setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-5 py-5 cursor-pointer hover:bg-muted/50 transition-colors group ${isCurrent ? 'bg-primary/5' : 'bg-muted/30'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`${isCurrent ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} p-2.5 rounded-xl transition-colors`}>
                        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </div>
                    <div>
                        <div className="font-serif text-2xl font-normal text-foreground flex items-center gap-2 leading-none mb-1">
                            Sprint {sprint.sprint_number}
                            {sprint.status === 'completed' ? (
                                <Badge variant="secondary" className="text-[10px] h-5 bg-green-500/20 text-green-400 border-green-500/30 font-bold font-sans">
                                    COMPLETED
                                </Badge>
                            ) : isCurrent && (
                                <Badge variant="default" className="text-[10px] h-5 bg-primary font-bold font-sans animate-pulse">
                                    CURRENT
                                </Badge>
                            )}
                            {(overdue || endUrgent) && (
                                <Badge className={`text-[10px] h-5 font-bold font-sans flex items-center gap-1 ${overdue ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'}`}>
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                    {overdue ? 'OVERDUE' : `${endDays}d left`}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-[10px] h-5 font-bold border-primary/20 font-sans ${isCurrent ? 'bg-primary/10 text-primary' : 'bg-background'}`}>
                                {completedTasks}/{totalTasks} DONE
                            </Badge>
                            {sprint.goals.length > 0 && (
                                <Badge variant="outline" className={`text-[10px] h-5 font-bold border-primary/20 flex items-center gap-1 font-sans ${sprint.goals.filter(g => g.is_completed).length === sprint.goals.length ? 'bg-green-50 text-green-700 border-green-200' : 'bg-background'}`}>
                                    <Target className="h-2.5 w-2.5" />
                                    {sprint.goals.filter(g => g.is_completed).length}/{sprint.goals.length} GOALS
                                </Badge>
                            )}
                        </div>
                        {isEditingDate ? (
                            <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="date"
                                    value={editDates.start_date}
                                    onChange={(e) => setEditDates({ ...editDates, start_date: e.target.value })}
                                    className="text-[11px] h-7 w-32 border-border/50 rounded-md shadow-sm bg-background"
                                />
                                <span className="text-muted-foreground">–</span>
                                <input
                                    type="date"
                                    value={editDates.end_date}
                                    onChange={(e) => setEditDates({ ...editDates, end_date: e.target.value })}
                                    className="text-[11px] h-7 w-32 border-border/50 rounded-md shadow-sm bg-background"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                    onClick={handleSaveDates}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => {
                                        setIsEditingDate(false);
                                        setEditDates({ start_date: sprint.start_date, end_date: sprint.end_date });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className={`text-xs flex items-center gap-2 mt-1.5 ${overdue ? 'text-red-500' : endUrgent ? 'text-red-500' : 'text-muted-foreground'}`}>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {sprint.start_date} – {sprint.end_date}
                                </div>
                                {can.manage && (
                                    <button
                                        className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1 group/edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingDate(true);
                                        }}
                                    >
                                        <Edit2 className="h-3 w-3" />
                                        <span className="text-[10px] opacity-0 group-hover/edit:opacity-100 transition-opacity">Edit</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex gap-4 text-xs">
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground uppercase text-[9px] font-bold tracking-widest">Progress</span>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-28 h-2 bg-muted rounded-full overflow-hidden border border-border/20">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${sprint.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`}
                                        style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="font-bold tabular-nums text-sm min-w-[3ch]">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <CardContent className="p-0 border-t border-border/50 bg-background animate-in slide-in-from-top-2 duration-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-muted text-muted-foreground uppercase text-sm tracking-wider font-bold border-b border-border/50">
                                    {project.segments.map((segment) => (
                                        <th key={segment.id} className="px-4 py-3 text-center border-r border-border/50 last:border-r-0">
                                            {segment.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {project.segments.map((segment) => {
                                        const sprintTasks = sprint.tasks?.filter(t => t.segment_id === segment.id) || [];
                                        return (
                                            <td key={segment.id} className="p-3 border-r border-border/50 last:border-r-0 align-top min-w-[200px]">
                                                <div className="space-y-3">
                                                    {sprintTasks.map((task) => (
                                                        <div 
                                                            key={task.id}
                                                            onClick={() => {
                                                                if (can.manage) {
                                                                    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                                                                    router.patch(route('tasks.update-status', task.id), { status: newStatus });
                                                                }
                                                            }}
                                                            className={`group flex items-start gap-2 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all hover:shadow-md hover:border-primary/40 ${
                                                                task.status === 'completed' 
                                                                    ? 'bg-green-500/10 border-green-500/20'
                                                                    : 'bg-background border-border shadow-sm'
                                                            }`}
                                                        >
                                                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                                                task.status === 'completed' 
                                                                    ? 'bg-green-500 border-green-500 text-white scale-110'
                                                                    : 'border-muted-foreground/30 group-hover:border-primary group-hover:scale-110'
                                                            }`}>
                                                                {task.status === 'completed' && <span className="text-[10px]">✓</span>}
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className={`font-medium break-words leading-relaxed ${task.status === 'completed' ? 'line-through text-muted-foreground opacity-60' : ''}`}>
                                                                    {task.title}
                                                                </div>
                                                                {/* <div className="flex items-center gap-2 mt-1.5">
                                                                    {task.estimated_hours > 0 && (
                                                                        <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                            <Clock className="h-2 w-2" /> {task.estimated_hours}h
                                                                        </span>
                                                                    )}
                                                                    {task.git_commits && task.git_commits.length > 0 && (
                                                                        <span className="text-[9px] text-primary/70 bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                            <GitIcon className="h-2 w-2" /> {task.git_commits.length}
                                                                        </span>
                                                                    )}
                                                                </div> */}
                                                                {task.git_commits && task.git_commits.length > 0 && (
                                                                    <div className="mt-2 pt-2 border-t border-dashed border-border/50 text-[10px] text-muted-foreground italic truncate">
                                                                        "{task.git_commits[task.git_commits.length - 1].message}"
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {can.manage && (
                                                        <QuickAddTask 
                                                            projectId={project.id} 
                                                            segmentId={segment.id} 
                                                            sprintId={sprint.id} 
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Weekly Goals, Meeting Log, Blockers */}
                    <GoalsSection sprint={sprint} project={project} can={can} />
                    <MeetingSection sprint={sprint} project={project} can={can} />
                    <BlockersSection sprint={sprint} project={project} can={can} />

                    {/* Sprint Actions Footer */}
                    <div className="px-5 py-4 bg-muted/20 border-t border-border/50 flex justify-between items-center">
                        <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5">
                            <Link href={route('projects.sprints.report', [project.id, sprint.id])} className="flex items-center">
                                <FileText className="mr-2 h-4 w-4 text-primary" /> View Sprint Report
                            </Link>
                        </Button>

                        {can.manage && sprint.status !== 'completed' && (
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/10"
                                onClick={() => {
                                    if (confirm('Are you sure you want to complete this sprint? Incomplete tasks will be carried over to the next sprint.')) {
                                        router.post(route('projects.sprints.complete', [project.id, sprint.id]));
                                    }
                                }}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Complete Sprint
                            </Button>
                        )}

                        {sprint.status === 'completed' && (
                            <div className="text-sm font-bold text-green-400 flex items-center gap-1.5 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                <CheckCircle2 className="h-4 w-4" /> Sprint Completed
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

function GoalsSection({ sprint, project, can }: { sprint: Sprint; project: Project; can: any }) {
    const [open, setOpen] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [saving, setSaving] = useState(false);

    const completedGoals = sprint.goals.filter(g => g.is_completed).length;
    const totalGoals = sprint.goals.length;

    const submitGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.trim()) return;
        setSaving(true);
        router.post(route('sprint-goals.store', [project.id, sprint.id]), { title: newGoal }, {
            onFinish: () => { setSaving(false); setAdding(false); setNewGoal(''); },
        });
    };

    return (
        <div className="border-t border-border/50 border-l-4 border-l-violet-400">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-500/10 transition-colors text-left bg-gradient-to-r from-violet-500/10 to-transparent"
            >
                <div className="flex items-center gap-2.5 text-xs font-bold text-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                        <Target className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    Weekly Goals
                    {totalGoals > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${completedGoals === totalGoals ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'}`}>
                            {completedGoals}/{totalGoals}
                        </span>
                    )}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
            </button>

            {open && (
                <div className="px-5 pb-4 pt-1 space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                    {sprint.goals.length === 0 && !adding && (
                        <div className="flex items-center gap-2 py-3 text-muted-foreground">
                            <Target className="h-4 w-4 text-violet-500/50" />
                            <span className="text-[12px]">No goals set for this sprint.</span>
                        </div>
                    )}
                    {sprint.goals.map((goal) => (
                        <div key={goal.id} className="flex items-center gap-2.5 group px-2 py-1.5 rounded-lg hover:bg-violet-500/10 transition-colors">
                            <button
                                onClick={() => can.manage && router.patch(route('sprint-goals.toggle', goal.id))}
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${goal.is_completed ? 'bg-green-400 border-green-400 text-white' : 'border-violet-300 hover:border-violet-500'} ${can.manage ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {goal.is_completed && <span className="text-[9px] font-bold">✓</span>}
                            </button>
                            <span className={`text-xs flex-1 ${goal.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {goal.title}
                            </span>
                            {can.manage && (
                                <button
                                    onClick={() => router.delete(route('sprint-goals.destroy', goal.id))}
                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}

                    {can.manage && (
                        adding ? (
                            <form onSubmit={submitGoal} className="flex items-center gap-2 pt-1">
                                <input
                                    autoFocus
                                    value={newGoal}
                                    onChange={e => setNewGoal(e.target.value)}
                                    placeholder="Enter a goal..."
                                    className="flex-1 text-xs bg-background border border-violet-500/30 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                                />
                                <Button type="submit" size="sm" className="h-7 px-3 text-[11px] bg-violet-600 hover:bg-violet-700 text-white" disabled={saving || !newGoal.trim()}>Add</Button>
                                <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => { setAdding(false); setNewGoal(''); }}>Cancel</Button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setAdding(true)}
                                className="flex items-center gap-1.5 text-[11px] text-violet-600/70 hover:text-violet-700 transition-colors pt-1 font-medium"
                            >
                                <Plus className="h-3 w-3" /> Add Goal
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function MeetingSection({ sprint, project, can }: { sprint: Sprint; project: Project; can: any }) {
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ meeting_date: new Date().toISOString().split('T')[0], summary: '', decisions: '' });
    const [saving, setSaving] = useState(false);

    const submitMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.summary.trim()) return;
        setSaving(true);
        router.post(route('sprint-meetings.store', [project.id, sprint.id]), form, {
            onFinish: () => { setSaving(false); setAdding(false); setForm({ meeting_date: new Date().toISOString().split('T')[0], summary: '', decisions: '' }); },
        });
    };

    return (
        <div className="border-t border-border/50 border-l-4 border-l-blue-400">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-500/10 transition-colors text-left bg-gradient-to-r from-blue-500/10 to-transparent"
            >
                <div className="flex items-center gap-2.5 text-xs font-bold text-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    Meeting Log
                    {sprint.meetings.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                            {sprint.meetings.length}
                        </span>
                    )}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
            </button>

            {open && (
                <div className="px-5 pb-4 pt-1 space-y-3 animate-in slide-in-from-top-1 duration-150">
                    {sprint.meetings.length === 0 && !adding && (
                        <div className="flex items-center gap-2 py-3 text-muted-foreground">
                            <MessageSquare className="h-4 w-4 text-blue-500/50" />
                            <span className="text-[12px]">No meetings logged this sprint.</span>
                        </div>
                    )}
                    {sprint.meetings.map((meeting) => (
                        <div key={meeting.id} className="bg-card border border-border/60 border-l-2 border-l-blue-400 rounded-lg p-3 space-y-1.5 group relative shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5 bg-blue-500/20 px-2 py-0.5 rounded-full">
                                    <Calendar className="h-3 w-3" /> {meeting.meeting_date}
                                </span>
                                {can.manage && (
                                    <button
                                        onClick={() => router.delete(route('sprint-meetings.destroy', meeting.id))}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs font-medium text-foreground leading-relaxed">{meeting.summary}</p>
                            {meeting.decisions && meeting.decisions.length > 0 && (
                                <ul className="space-y-1 pt-1.5 border-t border-dashed border-border/40">
                                    {meeting.decisions.map((d, i) => (
                                        <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5 shrink-0">›</span> {d}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {can.manage && (
                        adding ? (
                            <form onSubmit={submitMeeting} className="space-y-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 animate-in fade-in duration-150">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase w-16 shrink-0">Date</label>
                                    <input
                                        type="date"
                                        value={form.meeting_date}
                                        onChange={e => setForm({ ...form, meeting_date: e.target.value })}
                                        className="text-xs bg-background border border-blue-500/30 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        required
                                    />
                                </div>
                                <div className="flex items-start gap-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase w-16 shrink-0 pt-1">Summary</label>
                                    <textarea
                                        autoFocus
                                        value={form.summary}
                                        onChange={e => setForm({ ...form, summary: e.target.value })}
                                        placeholder="What was discussed?"
                                        rows={2}
                                        className="flex-1 text-xs bg-background border border-blue-500/30 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                                        required
                                    />
                                </div>
                                <div className="flex items-start gap-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase w-16 shrink-0 pt-1">Decisions</label>
                                    <textarea
                                        value={form.decisions}
                                        onChange={e => setForm({ ...form, decisions: e.target.value })}
                                        placeholder="One decision per line..."
                                        rows={2}
                                        className="flex-1 text-xs bg-background border border-blue-500/30 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" size="sm" variant="ghost" className="h-7 px-3 text-[11px]" onClick={() => setAdding(false)}>Cancel</Button>
                                    <Button type="submit" size="sm" className="h-7 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !form.summary.trim()}>Log Meeting</Button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setAdding(true)}
                                className="flex items-center gap-1.5 text-[11px] text-blue-600/70 hover:text-blue-700 transition-colors font-medium"
                            >
                                <Plus className="h-3 w-3" /> Log Meeting
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function BlockersSection({ sprint, project, can }: { sprint: Sprint; project: Project; can: any }) {
    const incompleteTasks = sprint.tasks.filter(t => t.status !== 'completed').length;
    const hasContent = incompleteTasks > 0 || sprint.completion_note;

    const [open, setOpen] = useState(!!sprint.completion_note);
    const [note, setNote] = useState(sprint.completion_note ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!hasContent && !can.manage) return null;

    const saveNote = () => {
        setSaving(true);
        router.patch(route('projects.sprints.save-note', [project.id, sprint.id]), { completion_note: note }, {
            onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
            onFinish: () => setSaving(false),
        });
    };

    return (
        <div className="border-t border-border/50 border-l-4 border-l-amber-400">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-500/10 transition-colors text-left bg-gradient-to-r from-amber-500/10 to-transparent"
            >
                <div className="flex items-center gap-2.5 text-xs font-bold text-foreground uppercase tracking-wider">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${incompleteTasks > 0 ? 'bg-amber-500/20' : 'bg-muted'}`}>
                        <AlertTriangle className={`h-3.5 w-3.5 ${incompleteTasks > 0 ? 'text-amber-400' : 'text-muted-foreground'}`} />
                    </div>
                    Blockers &amp; Incomplete Reasons
                    {incompleteTasks > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {incompleteTasks} incomplete
                        </span>
                    )}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
            </button>

            {open && (
                <div className="px-5 pb-4 pt-1 space-y-2.5 animate-in slide-in-from-top-1 duration-150">
                    {!can.manage && !sprint.completion_note && (
                        <div className="flex items-center gap-2 py-3 text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-amber-500/50" />
                            <span className="text-[12px]">No blockers logged.</span>
                        </div>
                    )}
                    {can.manage ? (
                        <div className="space-y-2.5">
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Log blockers, reasons for incomplete tasks, or any notes about what prevented completion..."
                                rows={3}
                                className="w-full text-xs bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none placeholder:text-amber-500/40"
                            />
                            <div className="flex justify-end">
                                <Button
                                    size="sm"
                                    variant={saved ? 'outline' : 'default'}
                                    className={`h-8 px-4 text-[11px] ${saved ? 'text-green-400 border-green-500/40' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                                    onClick={saveNote}
                                    disabled={saving}
                                >
                                    {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Note'}
                                </Button>
                            </div>
                        </div>
                    ) : sprint.completion_note ? (
                        <p className="text-xs text-amber-300 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 whitespace-pre-wrap leading-relaxed">
                            {sprint.completion_note}
                        </p>
                    ) : null}
                </div>
            )}
        </div>
    );
}

function GitAccordion({ project }: { project: Project }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className={`overflow-hidden transition-all duration-300 mb-6 ${isOpen ? 'border-primary/20 ring-1 ring-primary/5 shadow-md' : 'border-primary/10 bg-primary/5 shadow-sm hover:bg-primary/10'}`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-1 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </div>
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <GitIcon className="h-5 w-5" /> Git Integration
                        </CardTitle>
                        <CardDescription>Auto-complete tasks via GitLab/GitHub commits</CardDescription>
                    </div>
                </div>
                {!isOpen && (
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Connected
                    </div>
                )}
            </div>

            {isOpen && (
                <CardContent className="px-4 pb-6 pt-2 space-y-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <ExternalLink className="h-3 w-3" /> Webhook URL
                            </Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-background border rounded-lg px-3 py-2.5 text-xs font-mono truncate select-all shadow-sm">
                                    {window.location.origin}/api/webhook/gitlab/{project.id}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 shrink-0 hover:bg-primary hover:text-white transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(`${window.location.origin}/api/webhook/gitlab/${project.id}`);
                                        alert('Webhook URL copied to clipboard');
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Check className="h-3 w-3" /> Webhook Secret
                            </Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-background border rounded-lg px-3 py-2.5 text-xs font-mono truncate select-all shadow-sm">
                                    {project.webhook_secret || 'Not generated'}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 shrink-0 hover:bg-primary hover:text-white transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(project.webhook_secret || '');
                                        alert('Secret key copied to clipboard');
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-muted/30 border rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">?</div>
                            Setup Instructions
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Step 1</div>
                                <div className="text-[11px] leading-relaxed">Add the <strong>Webhook URL</strong> to your GitLab/GitHub project settings.</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Step 2</div>
                                <div className="text-[11px] leading-relaxed">Set the <strong>Trigger</strong> to "Push events" and paste the <strong>Secret</strong> key.</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Step 3</div>
                                <div className="text-[11px] leading-relaxed">Commit with <code>#TASK_ID done</code> (e.g. <code>Fix bug #102 done</code>) to auto-complete.</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}


function QuickAddTask({ projectId, segmentId, sprintId }: { projectId: number, segmentId: number, sprintId: number }) {
    const [isAdding, setIsAdding] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        segment_id: segmentId,
        sprint_id: sprintId,
        priority: 'medium',
        estimated_hours: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.tasks.store', projectId), {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            },
        });
    };

    if (!isAdding) {
        return (
            <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-2 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-1 group"
            >
                <Plus className="h-3 w-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium">Add Task</span>
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="p-3 bg-background border rounded-lg shadow-lg space-y-3 animate-in fade-in zoom-in duration-200">
            <div className="space-y-1">
                <textarea
                    autoFocus
                    className="w-full bg-transparent border-none p-0 text-xs font-medium focus:ring-0 placeholder:text-muted-foreground resize-none min-h-[1.5rem]"
                    placeholder="Enter task(s)... (Paste multiple lines for bulk)"
                    value={data.title}
                    onChange={e => {
                        setData('title', e.target.value);
                        // Auto-expand
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit(e as any);
                        }
                    }}
                    rows={1}
                    required
                />
            </div>
            <div className="flex items-center justify-between gap-2 border-t pt-2">
                <div className="flex items-center gap-1">
                    <select 
                        className="text-[10px] bg-muted border-none rounded px-1 py-0.5 focus:ring-0"
                        value={data.priority}
                        onChange={e => setData('priority', e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Med</option>
                        <option value="high">High</option>
                    </select>
                    <div className="flex items-center gap-1 bg-muted rounded px-1 py-0.5">
                        <Clock className="h-2 w-2 text-muted-foreground" />
                        <input 
                            type="number" 
                            step="0.5"
                            className="w-6 text-[10px] bg-transparent border-none p-0 focus:ring-0"
                            value={data.estimated_hours}
                            onChange={e => setData('estimated_hours', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-[10px]" 
                        onClick={() => setIsAdding(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        size="sm" 
                        className="h-6 px-2 text-[10px]" 
                        disabled={processing || !data.title.trim()}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </form>
    );
}

