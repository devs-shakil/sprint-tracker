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
    projects: Project[];
}

export default function Index({ projects }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Projects
                    </h2>
                    <Button>
                        <Link href={route('projects.create')} className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {projects.length === 0 ? (
                        <Card className="text-center p-12">
                            <CardHeader>
                                <CardTitle>No projects yet</CardTitle>
                                <CardDescription>
                                    Create your first project to start tracking sprints.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size="lg">
                                    <Link href={route('projects.create')}>
                                        Get Started
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Card key={project.id} className="hover:ring-2 hover:ring-primary/20 transition-all group">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="group-hover:text-primary transition-colors">
                                                    {project.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center mt-1">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {project.start_date} - {project.end_date}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Segments</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.segments.map((segment) => (
                                                        <Badge key={segment.id} variant="outline" className="bg-muted/50">
                                                            {segment.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    {project.members.length} Members
                                                </div>
                                                <Button size="sm" variant="ghost">
                                                    <Link href={route('projects.show', project.id)} className="flex items-center">
                                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
