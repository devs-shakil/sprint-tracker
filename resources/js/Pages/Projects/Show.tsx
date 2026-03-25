import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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

interface Project {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    segments: Segment[];
    members: Member[];
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
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{project.start_date} to {project.end_date}</span>
                                    </div>
                                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                        {project.status}
                                    </Badge>
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
