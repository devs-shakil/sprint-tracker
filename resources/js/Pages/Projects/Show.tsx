import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { Users, Calendar, ArrowLeft, Trash2, UserPlus, Plus, Clock, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

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

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    estimated_hours: number;
    segment_id: number;
    sprint_id?: number;
    assignee?: User;
}

interface Sprint {
    id: number;
    sprint_number: number;
    start_date: string;
    end_date: string;
    tasks: Task[];
}

interface Project {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
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
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route('projects.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        {project.name}
                    </h2>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
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

                    {/* Sprints Section - Accordion Grid */}
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="flex flex-row items-center justify-between px-0 pb-4">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Calendar className="h-6 w-6 text-primary" /> Sprints
                                </CardTitle>
                                <CardDescription>Manage your project sprints and tasks.</CardDescription>
                            </div>
                            {can.manage && (
                                <div className="flex gap-2">
                                    <Button 
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
                                    </Button>
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
                                project.sprints.map((sprint, index) => (
                                    <SprintAccordion 
                                        key={sprint.id} 
                                        sprint={sprint} 
                                        project={project} 
                                        can={can} 
                                        isDefaultOpen={index === 0}
                                    />
                                ))
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

function SprintAccordion({ sprint, project, can, isDefaultOpen = false }: { sprint: Sprint, project: Project, can: any, isDefaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);

    return (
        <Card className="overflow-hidden border-border/50">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        {isOpen ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                        <div className="font-bold text-lg text-foreground flex items-center gap-2">
                            Sprint {sprint.sprint_number}
                            <Badge variant="outline" className="text-[10px] h-5">
                                {sprint.tasks.length} Tasks
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" /> {sprint.start_date} – {sprint.end_date}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex gap-4 text-xs">
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground uppercase text-[9px] font-bold">Planned</span>
                            <span className="font-semibold">{sprint.tasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0)}h</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground uppercase text-[9px] font-bold">Done</span>
                            <span className="font-semibold text-green-600">
                                {sprint.tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + (t.estimated_hours || 0), 0)}h
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <CardContent className="p-0 border-t border-border/50 bg-background animate-in slide-in-from-top-2 duration-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-muted/20 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/50">
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
                                                <div className="space-y-2">
                                                    {sprintTasks.map((task) => (
                                                        <div 
                                                            key={task.id}
                                                            onClick={() => {
                                                                if (can.manage) {
                                                                    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                                                                    router.patch(route('tasks.update-status', task.id), { status: newStatus });
                                                                }
                                                            }}
                                                            className={`group flex items-start gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all hover:shadow-md hover:border-primary/40 ${
                                                                task.status === 'completed' 
                                                                    ? 'bg-muted/30 border-transparent' 
                                                                    : 'bg-background border-border shadow-sm'
                                                            }`}
                                                        >
                                                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                                                task.status === 'completed' 
                                                                    ? 'bg-primary border-primary text-white scale-110' 
                                                                    : 'border-muted-foreground/30 group-hover:border-primary group-hover:scale-110'
                                                            }`}>
                                                                {task.status === 'completed' && <span className="text-[10px]">✓</span>}
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className={`font-medium break-words leading-relaxed ${task.status === 'completed' ? 'line-through text-muted-foreground opacity-60' : ''}`}>
                                                                    {task.title}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1.5">
                                                                    {task.estimated_hours > 0 && (
                                                                        <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                            <Clock className="h-2 w-2" /> {task.estimated_hours}h
                                                                        </span>
                                                                    )}
                                                                </div>
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

