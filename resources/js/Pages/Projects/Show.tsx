import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { Users, Calendar, ArrowLeft, Trash2, UserPlus } from 'lucide-react';
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

interface Sprint {
    id: number;
    sprint_number: number;
    start_date: string;
    end_date: string;
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className={`grid grid-cols-1 ${can.manage ? 'md:grid-cols-3' : ''} gap-6`}>
                        {/* Project Info */}
                        <Card className={can.manage ? 'md:col-span-2' : ''}>
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
                        </Card>

                        {/* Add Member Form - Owner Only */}
                        {can.manage && (
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
                        )}
                    </div>

                    {/* Sprints Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" /> Project Sprints
                                </CardTitle>
                                <CardDescription>Sprint schedule generated from working days.</CardDescription>
                            </div>
                            {can.manage && (
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            if (confirm('Regenerate sprints with 6 days each?')) {
                                                router.post(route('projects.sprints.store', project.id), {
                                                    days_per_sprint: 6
                                                });
                                            }
                                        }}
                                    >
                                        {project.sprints.length > 0 ? 'Regenerate' : 'Generate Sprints'}
                                    </Button>
                                    {project.sprints.length > 0 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-destructive"
                                            onClick={() => {
                                                if (confirm('Clear all sprints?')) {
                                                    router.delete(route('projects.sprints.destroy', project.id));
                                                }
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3">Sprint #</th>
                                            <th className="px-4 py-3">Start Date</th>
                                            <th className="px-4 py-3">End Date</th>
                                            <th className="px-4 py-3 text-right">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {project.sprints.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                                                    No sprints generated yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            project.sprints.map((sprint) => (
                                                <tr key={sprint.id} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3 font-semibold">Sprint {sprint.sprint_number}</td>
                                                    <td className="px-4 py-3">{sprint.start_date}</td>
                                                    <td className="px-4 py-3">{sprint.end_date}</td>
                                                    <td className="px-4 py-3 text-right text-muted-foreground">
                                                        Standard (6 days)
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members List */}
                    <Card>
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
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
