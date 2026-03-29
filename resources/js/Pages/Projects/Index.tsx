import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Plus, Users, Calendar, ArrowRight } from 'lucide-react';

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

interface Sprint {
    id: number;
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
    sprints: Sprint[];
}

interface Props {
    projects: Project[];
    can: {
        create: boolean;
    };
}

export default function Index({ projects, can }: Props) {
    const calculateProgress = (project: Project) => {
        const allTasks = project.sprints.flatMap(s => s.tasks);
        if (allTasks.length === 0) return 0;
        const completedTasks = allTasks.filter(t => t.status === 'completed').length;
        return Math.round((completedTasks / allTasks.length) * 100);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Projects
                    </h2>
                    {can.create && (
                        <Button className="bg-primary hover:bg-primary/90">
                            <Link href={route('projects.create')} className="flex items-center">
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Link>
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12 bg-muted/30 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {projects.length === 0 ? (
                        <Card className="text-center p-12 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">No projects yet</CardTitle>
                                <CardDescription>
                                    Create your first project to start tracking sprints and tasks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size="lg" className="px-8">
                                    <Link href={route('projects.create')}>
                                        Get Started
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const progress = calculateProgress(project);
                                return (
                                    <Card key={project.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-border/50 bg-background overflow-hidden">
                                        <CardHeader className="pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                    {project.status}
                                                </Badge>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Deadline: {project.end_date}
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {project.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-6">
                                            {/* Progress Section */}
                                            <div>
                                                <div className="flex justify-between items-center text-xs mb-2">
                                                    <span className="font-semibold text-muted-foreground">Overall Progress</span>
                                                    <span className="font-bold text-primary">{progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/10">
                                                    <div 
                                                        className="h-full bg-primary transition-all duration-1000" 
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center pt-4 border-t border-border/50">
                                                <Link 
                                                    href={route('projects.show', project.id)} 
                                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-3 transition-all"
                                                >
                                                    View Details <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
