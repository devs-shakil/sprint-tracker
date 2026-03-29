import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Calendar, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    estimated_hours: number;
    segment?: { name: string };
    sprint?: { sprint_number: number };
    assignee?: { name: string };
}

interface Project {
    id: number;
    name: string;
}

interface Props {
    project: Project;
    tasks: Task[];
}

export default function Index({ project, tasks }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route('projects.show', project.id)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        {project.name} Tasks
                    </h2>
                </div>
            }
        >
            <Head title={`${project.name} Tasks`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task List</CardTitle>
                            <CardDescription>
                                All tasks associated with {project.name}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3">Task</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Segment</th>
                                            <th className="px-4 py-3">Sprint</th>
                                            <th className="px-4 py-3">Assignee</th>
                                            <th className="px-4 py-3 text-right">Estimate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {tasks.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                                                    No tasks found for this project.
                                                </td>
                                            </tr>
                                        ) : (
                                            tasks.map((task) => (
                                                <tr key={task.id} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium underline decoration-primary/30 underline-offset-4">
                                                            {task.title}
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <Badge variant="outline" className={`text-[10px] uppercase ${
                                                                task.priority === 'high' ? 'text-red-500 border-red-200' : 
                                                                task.priority === 'medium' ? 'text-yellow-600 border-yellow-200' : 'text-blue-500 border-blue-200'
                                                            }`}>
                                                                {task.priority}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {task.status === 'completed' ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            ) : task.status === 'in_progress' ? (
                                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                            ) : (
                                                                <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                                                            )}
                                                            <span className="capitalize">{task.status.replace('_', ' ')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {task.segment ? (
                                                            <Badge variant="secondary">{task.segment.name}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">General</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {task.sprint ? (
                                                            <span className="font-medium">Sprint {task.sprint.sprint_number}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {task.assignee ? (
                                                            <span>{task.assignee.name}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {task.estimated_hours}h
                                                    </td>
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
